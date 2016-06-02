/**
 *
 *
 */

import debug from 'debug';
import pick from 'lodash/pick';
import isNil from 'lodash/isNil';
import sortBy from 'lodash/sortBy';
import omitBy from 'lodash/omitBy';

import Actions from '../actions';
import { navigateAction } from '../Route/RouteActions';
import StageStore from '../Stage/StageStore';
import VisitStore from '../Visit/VisitStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Visit:VisitActions');

/**
 *
 */
export function ClearVisitListAction(context, payload, done) {
    __debug(" ==> Action: ClearVisitList");
    context.dispatch(Actions.VISIT_LIST_CLEAR);
    done();
}

/**
 *
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

            var promises = [];

            data.map((visit, index) => {
                promises.push(
                    context.service
                        .read('RecordService')
                        .params({
                            patients: visit.patients,
                            visit: visit.id,
                            stages: [1]
                        }).end().then(({data}) => {
                            ///                 0 = .read() returns array of objects, grab the first
                            var patients = data[0][1];
                            ///                    1 = root stage
                            visit.patients = sortBy(patients, ['priority', 'birthday', 'createdAt']);
                            return visit;
                        })
                );
            });

            Promise.all(promises).then(visits => {
                context.dispatch(Actions.VISIT_LIST_UPDATE, visits);
                done();
            });

        });
}



// ============================== \\



/**
 *
 */
export function ClearVisitAction(context, payload, done) {
    __debug(" ==> Action: ClearVisit");
    context.dispatch(Actions.VISIT_CLEAR);
    done();
}

/*
 * Create and/or update a visit record with patient data.
 * Update records with patient data as necessary.
 */
export function SaveVisitAction(context, { id, patients, stage }, done) {

    __debug("Saving visit...");

    var patientKeys         = Object.keys(patients);
    var writableFieldKeys   = Object.keys(stage.fields);

    context.dispatch(Actions.APP_LOADING, true);

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
            __debug("Promises completed.");
            context.dispatch(Actions.VISIT_SET_MODIFIED, false);
            context.dispatch(Actions.APP_FLASH, {
                className: "small",
                type: "success",
                icon: "check mark",
                header: "Visit saved."
            });
            context.dispatch(Actions.APP_LOADING, false);
            done();
        });

    };

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
                complete(context.getStore(VisitStore).getVisit());
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
}

/**
 *
 */
export function MoveVisitAction(context, { id, destination }, done) {

    __debug("Moving visit.");

    if(!id || !destination) {
        __debug("...missing visit ID / destination stage ID. Aborting.");
        done();
        return;
    }

    context.dispatch(Actions.APP_LOADING, true);
    context.service
        .update('VisitService')
        .params({
            id: id
        })
        .body({
            stage: destination
        }).end().then(() => {
            __debug("...update complete.");
            context.dispatch(Actions.VISIT_SET_RECENT_DATA, {
                visit: id,
                stage: destination
            });
            context.dispatch(Actions.VISIT_CLEAR);
            context.dispatch(Actions.PATIENT_CLEAR_ALL);
            context.dispatch(Actions.APP_LOADING, false);
            done();
        });
}

/*
 *
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

                    context.dispatch(Actions.PATIENT_UPDATE, patients);
                    done();
                    return;
                });
        });
}



// ============================== \\



/**
 *
 */
export function SetCurrentTabAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_CURRENT_TAB, payload);
    done();
}

/**
 *
 */
export function CreatePatientAction(context, payload, done) {
    context.dispatch(Actions.APP_LOADING, true);
    context.dispatch(Actions.VISIT_SET_RECENT_DATA, null);
    context.service
        .create('PatientService')
        .end().then(({data}) => {
            __debug("Patient created:");
            __debug(data);
            context.dispatch(Actions.APP_LOADING, false);
            context.dispatch(Actions.PATIENT_UPDATE, {
                [data.id]: {
                    [payload.stageID]: data
                }
            });
            context.dispatch(Actions.VISIT_SET_CURRENT_TAB, data.id);
            done();
        });
}

/**
 *
 */
export function SetDestinationAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_DESTINATION, payload.stageID);
    done();
}

/**
 *
 */
export function SetOverviewModeAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_OVERVIEW_MODE, payload);
    done();
}


/**
 *
 */
export function SetRecentVisitDataAction(context, payload, done) {
    __debug(" ==> Action: SetRecentVisitData");
    context.dispatch(Actions.VISIT_SET_RECENT_DATA, payload);
    done();
}
