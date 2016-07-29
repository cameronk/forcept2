/**
 * forcept - flux/Visit/VisitActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import pick from 'lodash/pick';
import isNil from 'lodash/isNil';
import sortBy from 'lodash/sortBy';
import omitBy from 'lodash/omitBy';

import Actions from '../actions';
import { ClearAllPatientsAction, PushPatientDataAction } from '../Patient/PatientActions';
import { FlashAppDataAction } from '../App/AppActions';
import { navigateAction } from '../Route/RouteActions';
import StageStore from '../Stage/StageStore';
import VisitStore from '../Visit/VisitStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Visit:VisitActions');

/*
 * Clear the list of visits within a stage.
 *
 * Payload: none
 */
export function ClearVisitListAction(context, payload, done) {
    __debug(" ==> Action: ClearVisitList");
    context.dispatch(Actions.VISIT_LIST_CLEAR);
    done();
}

/*
 * Read all visits (with patient data) at the specified stageID
 *
 * Payload:
 *  - stageID: stage ID to read from
 */
export function ReadVisitsAtStageAction(context, payload, done) {

    __debug(" ==> Action: ReadVisisAtStage");

    context.service
        .read('VisitService')
        .params({
            where: {
                stage: payload.stageID
            }
        }).end().then(({data}) => {

            __debug("Found %s visits at stage %s", data.length, payload.stageID);

            var promises = data.map(
                (visit, index) => (
                    context.service
                        .read('RecordService')
                        .params({
                            patients: visit.patients,
                            visit: visit.id,
                            stages: [1]
                        }).end().then(({data}) => {

                            ///                 0 = .read() returns array of objects, grab the first
                            ///                    1 = root stage
                            var patients = data[0][1];

                            visit.patients = sortBy(patients, ['priority', 'birthday', 'createdAt']);

                            return visit;
                        })
                )
            );

            Promise.all(promises).then(visits => {
                context.dispatch(Actions.VISIT_LIST_UPDATE, visits);
                done();
            });

        });
}

// ============================== \\

/*
 * Set the status of the current visit ("creating", "saving")
 *
 * Payload: string status
 */
export function SetVisitStatusAction(context, status, done) {
    __debug("Setting visit status => %s", status)
    context.dispatch(Actions.VISIT_SET_STATUS, status);
    done();
}

/*
 * Set the status of the current visit ("saving", "saved")
 *
 * Payload: string status
 */
export function SetVisitModifiedStateAction(context, state, done) {
    context.dispatch(Actions.VISIT_SET_MODIFIED, state);
    done();
}

/*
 * Clear visit data.
 *
 * Payload: none
 */
export function ClearVisitAction(context, payload, done) {
    __debug(" ==> Action: ClearVisit");
    context.dispatch(Actions.VISIT_CLEAR);
    done();
}

/*
 * Create and/or update a visit record with patient data.
 * Update records with patient data as necessary.
 *
 * Payload:
 *  - id: the visit ID to save (null if the visit hasn't been created yet!)
 *  - patients: patients object containing patient data (keyed by patient ID)
 *  - stage: stage object of the current visit
 */
export function SaveVisitAction(context, { id, patients, stage }, done) {

    __debug("Saving visit...");

    var patientKeys         = Object.keys(patients);
    var writableFieldKeys   = Object.keys(stage.fields);

    var complete = function(visit) {

        __debug("Updating records for %s patient(s).", patientKeys.length);
        __debug(" | potential fields: %s", JSON.stringify(writableFieldKeys));

        var promises = [];

        for(var i in patientKeys) {

            /*
             * Use field keys to pick which values are able to be saved to the database.
             * This eliminates accidentally pushing columns like 'id' or 'createdAt'.
             */
            var patientID = patientKeys[i];
            var thisPatientWritableFields = pick(patients[patientID][stage.id], writableFieldKeys);
            var identifierFields, modelName;

            __debug(" |==> ID #%s", patientID);
            __debug(" |--|==> fields: %s", JSON.stringify(Object.keys(thisPatientWritableFields)));

            /*
             * If this is the root stage, ensure the patient ID is passed
             * and that the patient is labeled as 'concrete'.
             * Also, update the current visit with the new visit's ID.
             */
            if(stage.isRoot) {

                /*
                 * Identify patient by patient ID alone.
                 */
                modelName = "Patient";
                identifierFields = {
                    id: patientID,
                };

                /*
                 * Apply a few extra fields to the patient record.
                 */
                thisPatientWritableFields = Object.assign(thisPatientWritableFields, {
                    visits: [visit.id],
                    concrete: true,
                    currentVisit: visit.id
                });

            } else {

                /*
                 * Identify patient by matrix [patientID, visitID]
                 */
                modelName = stage.tableName;
                identifierFields = {
                    patient: patientID,
                    visit: visit.id
                };

            }

            __debug(" |--|==> identifiers:", identifierFields);
            __debug(" |--|==> body:", thisPatientWritableFields);

            promises.push(
                context.service
                    .update('RecordService')
                    .params({
                        model: modelName,
                        identify: identifierFields
                    })
                    .body( thisPatientWritableFields ).end()
            );

        }

        Promise.all(promises).then(() => {

            Promise.all([

                /// We just saved the visit, so it's no longer in "modified" state
                context.executeAction(SetVisitModifiedStateAction, false),

                /// Flash a success message to the visit page
                context.executeAction(FlashAppDataAction, {
                    className: "small",
                    type: "success",
                    icon: "check mark",
                    header: "Visit saved."
                }),

                /// Update the visit status to un-disable fields
                context.executeAction(SetVisitStatusAction, "saved")

            ]).then(done);

        });

    };


    /*
     * Let the Visit handler know we're saving stuff.
     */
    context.executeAction(SetVisitStatusAction, "saving", () => {

        /*
         * If this visit has already been created...
         */
        if(id) {
            __debug("Saving visit ID: %s", id);

            /*
             * Update the patient array in Visit record.
             */
            context.service
                .update('VisitService')
                .params({
                    id: id
                })
                .body({
                    patients: patientKeys
                }).end().then(() => {
                    complete(
                        context.getStore(VisitStore).getVisit()
                    );
                });

        }

        /*
         * Create a new visit.
         */
        else {
            __debug("Creating a new visit.");

            context.service
                .create('VisitService')
                .body({
                    stage: stage.id,
                    patients: patientKeys,
                }).end().then(({ data }) => {

                    var visit = JsonModel(data);

                    /*
                     * Update visit store with new visit data.
                     */
                    context.dispatch(Actions.VISIT_UPDATE_VISIT, visit);

                    complete(visit);

                });
        }

    });
}

/*
 * Move a visit from the current stage to the destination stage.
 *
 * Payload:
 *  - id: visit ID to move
 *  - destination: destination stage ID to move to
 */
export function MoveVisitAction(context, { id, destination }, done) {

    __debug("Moving visit.");

    if(!id || !destination) {
        __debug("...missing visit ID / destination stage ID. Aborting.");
        done();
    }

    var complete = () => {

        Promise.all([
            context.executeAction(SetRecentVisitDataAction, {
                visit: id,
                stage: destination
            }),
            context.executeAction(ClearVisitAction),
            context.executeAction(ClearAllPatientsAction),
            context.executeAction(SetVisitStatusAction, null)
        ]).then(done);

    };

    /*
     * Let the Visit handler know we're saving stuff.
     */
    context.executeAction(SetVisitStatusAction, "moving", () => {

        context.service
            .update('VisitService')
            .params({
                id: id
            })
            .body({
                stage: destination
            }).end().then(({ data }) => {

                __debug("...updated Visit record. Nullifying patient visit locations.");

                if(destination === "checkout") {

                    var visit = data,
                        promises = [];

                    (visit.patients).map(patientID => {
                        promises.push(
                            context.service
                                .update('RecordService')
                                .params({
                                    model: "Patient",
                                    identify: {
                                        id: patientID
                                    }
                                })
                                .body({
                                    currentVisit: null
                                }).end()
                        );
                    });

                    Promise.all(promises).then(complete);

                } else complete();

            });

    });

}

/*
 * Grab data for a visit by ID.
 *
 * Payload:
 *  - id: visit ID
 */
export function GrabVisitAction(context, payload, done) {

    __debug(" ==> Action: GrabVisit (id=%s)", payload.id);

    /*
     * Grab this visit's data.
     */
    return context.service
        .read('VisitService')
        .params({
            where: {
                id: payload.id
            }
        }).end().then(({data}) => {

            /*
             * Convert visit to a JSON model.
             */
            var visit = JsonModel(data[0]);

            /*
             * Dispatch event to update page with visit info.
             */
            context.dispatch(Actions.VISIT_UPDATE_VISIT, visit);

            /*
             * Fetch *all* available records for each patient.
             */
            return context.service
                .read('RecordService')
                .params({
                    patients: visit.patients,
                    visit: visit.id,
                    stages: "*"
                }).end().then(({data}) => {

                    var collapsed = Object.assign(...data);
                    var patients = {};

                    /*
                     * Process returned data into a usable object.
                     */
                    for(let stageID in collapsed) {
                        collapsed[stageID].map((record) => {

                            /*
                             * Root stage identifier is     record.id
                             * Other stages identify with   record.patient
                             */
                            var patientID = stageID == 1 ? record.id : record.patient;

                            if(!patients.hasOwnProperty(patientID)) {
                                patients[patientID] = {};
                            }

                            /*
                             * Omit null values from object.
                             */
                            patients[patientID][stageID] = omitBy(JsonModel(record), isNil);
                        });
                    }

                    return context.executeAction(PushPatientDataAction, patients, () => done());

                });
        });
}

// ============================== \\

/*
 * Set the current tab within the visit page.
 *
 * Payload: name of tab (either the ID of a patient, null, or "import")
 */
export function SetCurrentTabAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_CURRENT_TAB, payload);
    done();
}

/*
 * Set the current visibility state of the sidebar.
 *
 * Payload: state (boolean)
 */
export function SetSidebarVisibilityAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_SIDEBAR_VISIBILITY, payload);
    done();
}

/*
 * Create a new patient.
 *
 * Payload:
 *  -
 */
export function CreatePatientAction(context, payload, done) {

    Promise.all([
        context.executeAction(SetRecentVisitDataAction, null),
        context.executeAction(SetVisitStatusAction, "creating")
    ]).then(() => {

        /*
         * Dispatch a service call to create a new patient.
         */
        context.service
            .create('PatientService')
            .end().then(({ data }) => {

                __debug("Patient created:");
                __debug(data);

                try {
                    Promise.all([
                        context.executeAction(PushPatientDataAction, {
                            [data.id]: {
                                [payload.stageID]: data
                            }
                        }),
                        context.executeAction(SetCurrentTabAction, data.id),
                        context.executeAction(SetVisitStatusAction, null)
                    ]).then(done);
                } catch(e) {
                    __debug("caught the error");
                    __debug(e);
                }
            });

    })

}

/*
 * Import provided patients into the current visit.
 *
 * Payload:
 *  - rootStageID: the ID of the FORCEPT root stage (patients can only be imported at the root stage)
 *  - patients: object of patients to add (keyed by ID)
 */
export function ImportPatientsAction(context, { rootStageID, patients }, done) {

    var dataToPush = {},
        patientKeys = Object.keys(patients);

    for(var patientID in patients) {
        dataToPush[patientID] = {
            [rootStageID]: patients[patientID]
        }
    }

    Promise.all([
        context.executeAction(SetVisitStatusAction, "importing"),
        context.executeAction(PushPatientDataAction, dataToPush)
    ]).then(() => {
        Promise.all([
            context.executeAction(SetCurrentTabAction, patientKeys[0]),
            context.executeAction(SetVisitStatusAction, null),
            context.executeAction(FlashAppDataAction, {
                id: "visit.messages.importSuccess",
                params: {
                    count: patientKeys.length
                }
            })
        ]).then(done);
    });

}

/*
 * Change the destination for the current visit.
 *
 * Payload:
 *  - stageID: destination stage id
 */
export function SetDestinationAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_DESTINATION, payload.stageID);
    done();
}

/*
 * unused
 */
export function SetOverviewModeAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_OVERVIEW_MODE, payload);
    done();
}


/*
 * Set the recent visit data (the id/destination of the last visit) for linking in the success message.
 *
 * Payload: (object of recent visit data)
 */
export function SetRecentVisitDataAction(context, payload, done) {
    __debug(" ==> Action: SetRecentVisitData");
    context.dispatch(Actions.VISIT_SET_RECENT_DATA, payload);
    done();
}
