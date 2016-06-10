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
        .params({}).end()
        .then(({ data }) => {

            var promises = [];
            var medications = Object.assign({}, JsonModel(data));

            for(var medicationID in medications) {
                let thisMedID = medicationID;
                var thisMed = medications[thisMedID];
                // medications[thisMedID].quantities = { test: true }; /// build initial quantities object
                __debug(" thisMed: %j", medications[thisMedID]);
                promises.push(
                    context.service
                        .read('MedQuantityService')
                        .params({
                            where: {
                                medication: medicationID
                            },
                            attributes: ['id', 'name', 'quantity']
                        }).end().then(({ data }) => {
                            var resp = {};
                            for(var quID in data) {
                                __debug(" - quID loop: %j", Object.assign(JsonModel(data[quID]), { medication: thisMedID }));
                                resp[quID] = Object.assign(JsonModel(data[quID]), { medication: thisMedID });
                            }
                            __debug("full resp: %j", resp);
                            return Object.assign({ test: true }, thisMed, {
                                "test2": false,
                                quants: resp
                            });
                        })
                )
            }

            Promise.all(promises).then((quantities) => {
                __debug(" quants: %j", quantities);
                __debug(" typeof: %s", typeof medications);
                __debug(" meds: %j", medications);

                quantities.map(quantityRecords => {
                    for(var recordID in quantityRecords) {
                        let record = quantityRecords[recordID];
                        __debug(" - recID: %j", record);
                        if(!medications[record.medication].hasOwnProperty('quantities')) {
                            medications[record.medication].quantities = {};
                        }
                        __debug(" - cached: %j", medications[record.medication]);
                        medications[record.medication].quantities[record.id] = {
                            id: record.id,
                            name: record.name,
                            available: record.quantity
                        };
                    }
                });

                context.dispatch(Actions.PHARMACY_MEDS_UPDATE, medications);
                context.dispatch(Actions.PHARMACY_MEDS_LOADED, true);
                done();
            });

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
                context.executeAction(UpdateMedicationCacheAction, {
                    quantities: {
                        [data.id]: data
                    }
                }, () => done());
            });
    }
}

/** ========================== **/

export function LoadPrescriptionSetAction(context, payload, done) {

    __debug("Loading prescription set for patient %s in visit %s", payload.patient, payload.visit);

    var medicationStore = context.getStore(MedicationStore);
    var identifiers = {
        visit: payload.visit,
        patient: payload.patient
    };

    var afterSetLoaded  = (set) => {
        context.dispatch(Actions.PHARMACY_PSET_UPDATE, { [set.patient]: set });
        context.executeAction(SetPharmacyStatusAction, "loaded", () => {
            done();
        });
    };

    var afterMedsLoaded = () => {
        context.service
            .read('PrescriptionService')
            .params({
                where: identifiers
            }).end()
            .then(({ data }) => {
                if(data.length > 0) {
                    /// Set was found
                    afterSetLoaded(data[0]);
                } else {
                    /// No set found, create one
                    context.service
                        .create('PrescriptionService')
                        .params({})
                        .body(identifiers).end()
                        .then(({ data }) => {
                            if(data) {
                                afterSetLoaded(data);
                            } else {
                                throw new Error("Unable to create set - no data returned.");
                            }
                        });
                }
            });
    };

    context.executeAction(SetPharmacyStatusAction, "loading", () => {
        if(!medicationStore.areMedicationsLoaded()) {
            context.executeAction(LoadMedicationsAction, {}, afterMedsLoaded);
        } else afterMedsLoaded();
    });

}
