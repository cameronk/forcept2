/*
 *
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import flatten from 'lodash/flatten';

import Actions from '../actions';
import MedicationStore from './MedicationStore';
import { navigateAction } from '../Route/RouteActions';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Pharmacy:MedicationActions');

/** ========================== **/

export function SetPharmacyStatusAction(context, payload, done) {
    context.dispatch(Actions.PHARMACY_SET_STATUS, payload);
    done();
}

/** ========================== **/

export function LoadMedicationsAction(context, payload, done) {
    __debug("Loading medications.");
    context.service
        .read('MedicationService')
        .params({
            getQuantities: true
        }).end()
        .then(({ data }) => {
            __debug("Loaded %s medications", Object.keys(data).length);
            context.dispatch(Actions.PHARMACY_MEDS_UPDATE, data);
            context.dispatch(Actions.PHARMACY_MEDS_LOADED, true);
            done();
        });
}

export function GrabMedicationAction(context, { id }, done) {
    __debug("Grabbing medication %s", id);

    var finish = (medication) => {
        context.dispatch(Actions.PHARMACY_MEDS_CACHE_UPDATE, medication);
        done();
    };

    var loadSpecific = () => {
        __debug(" - medication not yet loaded, grabbing from database");
        context.service
            .read('MedicationService')
            .params({
                where: {
                    id: id
                }
            }).end()
            .then(({ data }) => {
                if(data.hasOwnProperty(id)) {
                    var medication = JsonModel(data[id]);

                    context.service
                        .read('MedQuantityService')
                        .params({
                            where: {
                                medication: medication.id
                            },
                            attributes: ['id', 'name', 'quantity']
                        }).end()
                        .then(({ data }) => {
                            medication.quantities = data || {};
                            finish(medication);
                        });

                } else throw new Error("GrabMedication response data missing requested medication");
            })
            .catch(err => {
                __debug(err);
                done();
            });
    }

    var medicationStore = context.getStore(MedicationStore);
    if(medicationStore.areMedicationsLoaded()) {
        var medications = medicationStore.getMedications();
        if(medications.hasOwnProperty(id)) {
            __debug(" - already loaded this medication, grabbing from store");
            finish(medications[id]);
        } else loadSpecific();
    }
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
    context.executeAction(SetPharmacyStatusAction, "saving", () => {

        let cache = context.getStore(MedicationStore).getCache();
        let id    = payload.id;
        let query;

        __debug("Saving medication '%s' to id '%s'", cache.name, id);

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

            if(cache.quantities) {
                for(var qID in cache.quantities) {
                    var thisQuantity = cache.quantities[qID];
                    __debug(" - Updating quantity ID %s", thisQuantity.id);
                    promises.push(
                        context.service
                            .update('MedQuantityService')
                            .params({
                                id: thisQuantity.id
                            }).body(omit(thisQuantity, ['id', 'medication'])).end()
                    );
                }
            }

            Promise.all(promises).then(() => {

                /// If the id has changed (the stage was created)
                if(medicationRecordID != id) {
                    context.executeAction(navigateAction, {
                        url: '/pharmacy/manage/' + medicationRecordID
                    });
                }

                context.executeAction(SetPharmacyStatusAction, "saved", () => {
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
    context.executeAction(SetPharmacyStatusAction, null, () => {
        context.executeAction(ClearMedicationCacheAction, {}, () => {
            context.executeAction(LoadMedicationsAction, {}, () => {
                if(route.params.hasOwnProperty("medicationID")) {
                    context.executeAction(GrabMedicationAction, {
                        id: route.params.medicationID
                    }, () => done());
                } else done();
            });
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
                __debug("Received a new MedQuantity: %j", data);
                context.executeAction(UpdateMedicationCacheAction, {
                    quantities: {
                        [data.id]: data
                    }
                }, () => done());
            });
    }
}
