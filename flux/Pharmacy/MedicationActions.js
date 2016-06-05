/*
 *
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';

import Actions from '../actions';
import { SetAppStatusAction } from '../App/AppActions';
import MedicationStore from './MedicationStore';
import { navigateAction } from '../Route/RouteActions';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Pharmacy:MedicationActions');

export function LoadMedicationsAction(context, payload, done) {
    context.service
        .read('MedicationService')
        .params({}).end()
        .then(({ data }) => {
            context.dispatch(Actions.PHARMACY_MEDS_UPDATE, data);
            done();
        });
}

export function GrabMedicationAction(context, { id }, done) {
    context.service
        .read('MedicationService')
        .params({
            where: {
                id: id
            }
        }).end()
        .then(({ data }) => {
            if(data.hasOwnProperty(id)) {
                context.dispatch(Actions.PHARMACY_MEDS_CACHE_UPDATE, data[id]);
                done();
            } else throw new Error("GrabMedication response data missing requested medication");
        })
        .catch(err => {
            __debug(err);
            done();
        });
}

/** ========================== **/

export function UpdateMedicationCacheAction(context, payload, done) {
    context.dispatch(Actions.PHARMACY_MEDS_CACHE_MODIFIED, true);
    context.dispatch(Actions.PHARMACY_MEDS_CACHE_UPDATE, payload);
    done();
}

export function ClearMedicationCacheAction(context, payload, done) {
    context.dispatch(Actions.PHARMACY_MEDS_CACHE_CLEAR);
    done();
}

export function SaveMedicationAction(context, payload, done) {
    context.executeAction(SetAppStatusAction, "saving", () => {

        let cache = context.getStore(MedicationStore).getCache();
        let id    = payload.id;
        let query;

        __debug("Saving stage '%s' to id '%s'", cache.name, id);

        if(id) {
            query = context.service
                .update('MedicationService')
                .params({
                    id: id
                })
                .body({ name: cache.name }).end();
        } else {
            query = context.service
                .create('MedicationService')
                .body({ name: cache.name }).end();
        }

        query.then(({ data }) => {

            var medicationRecordID = data.id;

            __debug("SaveMedication query complete.");
            __debug(" - medication.id = %s", medicationRecordID);
            __debug(" - id       = %s", id);

            var promises = [];

            // if(cache.displays) {
            //     for(var display in cache.displays) {
            //         let thisDisplay = cache.displays[display];
            //         promises.push(
            //             context.service
            //                 .update('DisplayService')
            //                 .params({
            //                     id: thisDisplay.id
            //                 }).body(omit(thisDisplay, ['id', 'group'])).end()
            //         );
            //     }
            // }

            Promise.all(promises).then(() => {

                /// If the id has changed (the stage was created)
                if(medicationRecordID != id) {
                    context.executeAction(navigateAction, {
                        url: '/pharmacy/manage/' + medicationRecordID
                    });
                }

                context.executeAction(SetAppStatusAction, "saved", () => {
                    context.executeAction(LoadMedicationsAction, {}, (err) => {
                        done();
                    });
                });

            });

        }).catch((err) => {
            __debug(err);
            done();
        });

    });
}

/** ========================== **/

export function LoadMedicationPageActions(context, route, done) {
    context.executeAction(ClearMedicationCacheAction, {}, () => {
        context.executeAction(LoadMedicationsAction, {}, () => {
            if(route.params.hasOwnProperty("medicationID")) {
                context.executeAction(GrabMedicationAction, {
                    id: route.params.medicationID
                }, () => done());
            } else done();
        });
    });
}

/** ========================== **/

export function AddMedQuantityAction(context, payload, done) {
    if(!payload.id) {
        throw new Error("Cannot add medication quantity without a medication ID");
        done();
    } else {
        context.service
            .create('MedQuantityService')
            .body({
                medication: payload.id
            }).end()
            .then(({ data }) => {
                context.executeAction(UpdateMedicationCacheAction, {
                    quantities: {
                        [data.id]: data
                    }
                }, () => done());
            });
    }
}
