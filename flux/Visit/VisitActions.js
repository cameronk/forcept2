/**
 *
 *
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';
import pick from 'lodash/pick';

import Actions from '../actions';
import { navigateAction } from '../Route/RouteActions';
import StageStore from '../Stage/StageStore';
import VisitStore from '../Visit/VisitStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Visit:VisitActions');

/*
 *
 */
export function RedirectRootAction(context, payload, done) {

    var stages = context.getStore(StageStore).getStages();
        stages = keyBy(stages, 'id');

    var thisStage = stages[payload.params.stageID.split('-')[0]];
    if(thisStage && thisStage.isRoot) {
        __debug("Stage is root, redirecting");
        context.executeAction(navigateAction, {
            url: '/visits/' + thisStage.slug + '/new'
        }, () => {
            done();
        });
    } else {
        __debug("Stage is not root, skipping extra navigateAction");
        done();
    }

}

/*
 *
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
            var metaFields, modelName;

            __debug(" |==> ID #%s", patientID);
            __debug(" |--|==> fields: %s", JSON.stringify(Object.keys(thisPatientWritableFields)));

            /*
             * If this is the root stage, ensure the patient ID is passed
             * and that the patient is labeled as 'concrete'.
             * Also, update the current visit with the new visit's ID.
             */
            if(stage.isRoot) {
                modelName = "Patient";
                metaFields = {
                    id: patientID,
                    visits: [visit.id],
                    concrete: true,
                    currentVisit: visit.id
                };
            } else {
                modelName = stage.tableName;
                metaFields = {
                    patient: patientID,
                    visit: visit.id
                };
            }

            var body = Object.assign(thisPatientWritableFields, metaFields);

            __debug(" |--|==> meta: %s", JSON.stringify(metaFields));
            __debug(" |--|==> body: %s", JSON.stringify(body));

            promises.push(
                context.service
                    .update('RecordService')
                    .params({
                        model: modelName
                    })
                    .body( body ).end()
            );

        }

        Promise.all(promises).then(() => {
            __debug("Promises completed.");
            context.dispatch(Actions.APP_LOADING, false);
            done();
        });
    };

    /*
     * If this visit has already been created
     */
    if(id) {
        __debug("Saving visit ID: %s", id);
        complete(context.getStore(VisitStore).getVisit());
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

/*
 *
 */
export function GrabVisitAction(context, payload, done) {
    return context.service
        .read('VisitService')
        .params({
            where: {
                id: payload.id
            }
        }).end().then(({data}) => {
            var visit = JsonModel(data[0]);
            context.dispatch(Actions.VISIT_UPDATE_VISIT, visit);
            return context.service
                .read('RecordService')
                .params({
                    patients: visit.patients,
                    visit: visit.id
                }).end().then(({data}) => {
                    __debug(data);
                    return;
                });
        });
}

/*
 * Update the stage cache via payload.
 */
export function UpdateCacheAction(context, payload, done) {
    // context.dispatch(Actions.VISIT_CACHE_MODIFIED);
    // context.dispatch(Actions.VISIT_UPDATE_CACHE, payload);
    done();
}

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
