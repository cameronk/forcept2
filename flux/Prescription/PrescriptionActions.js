/**
 *
 */

import debug from 'debug';

import Actions from '../actions';
import MedicationStore from '../Pharmacy/MedicationStore';
import PrescriptionStore from './PrescriptionStore';
import { LoadMedicationsAction } from '../Pharmacy/MedicationActions';

const __debug = debug('forcept:flux:Prescription:PrescriptionActions');

/** ========================== **/

export function SetPrescriptionStatusAction(context, payload, done) {
    context.dispatch(Actions.PRESCRIPTION_UPDATE_STATUS, payload);
    done();
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
        context.dispatch(Actions.PRESCRIPTION_SET_UPDATE, {
            [set.patient]: set
        });
        context.executeAction(SetPrescriptionStatusAction, "loaded", () => {
            done();
        });
    };

    var afterMedsLoaded = () => {
        context.service
            .read('PrescriptionSetService')
            .params({
                where: identifiers,
                getPrescriptions: true
            }).end()
            .then(({ data }) => {
                if(data.length > 0) {
                    /// Set was found
                    afterSetLoaded(data[0]);
                } else {
                    /// No set found, create one
                    context.service
                        .create('PrescriptionSetService')
                        .params({})
                        .body(Object.assign({
                            createdBy: context.getUser('id')
                        }, identifiers)).end()
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

    context.executeAction(SetPrescriptionStatusAction, "loading", () => {
        if(!medicationStore.areMedicationsLoaded()) {
            context.executeAction(LoadMedicationsAction, {}, afterMedsLoaded);
        } else afterMedsLoaded();
    });

}

/** ========================== **/

export function PrescribeAction(context, { patientID, setID, dosageID, medicationID }, done) {
    context.executeAction(SetPrescriptionStatusAction, "prescribing", () => {

        var prescriptionStore = context.getStore(PrescriptionStore);
        var thisSet = prescriptionStore.getSet(patientID);

        if(thisSet) {

            // make sure the prescriptions property is set
            if(thisSet.hasOwnProperty('prescriptions')) {

                // Search the current prescriptions object for already-existing instances of this prescription
                var findPreExisting = Object.values(thisSet.prescriptions).filter(prescription => (prescription.dosageID == dosageID && !prescription.completed) );
                var promise;

                __debug("Found %i pre-existing, incomplete instances of this dosage within the set.", findPreExisting.length);

                if(findPreExisting.length > 0) {
                    promise = context.service
                        .update('PrescriptionService')
                        .params({
                            // we can only ever have one non-completed instance of a medication,
                            // so grab the first element of the array and take its
                            // "id" (the ID of the Prescription row)
                            id: findPreExisting[0].id,
                        })
                        .body({
                            // since the prescription must not be completed, just
                            // add 1 to its amount (like prescribing a second dose)
                            amount: parseInt(findPreExisting[0].amount) + 1,
                        }).end();
                }
                // this is a new prescription
                else {
                    promise = context.service
                        .create('PrescriptionService')
                        .body({
                            setID: setID,
                            medicationID: medicationID,
                            dosageID: dosageID,
                            amount: 1,
                            createdBy: context.getUser('id')
                        }).end();
                }

                promise.then(({ data }) => {
                    context.executeAction(UpdatePrescriptionSetAction, {
                        [patientID]: {
                            prescriptions: {
                                [data.id]: data
                            }
                        }
                    }, () => {
                        context.executeAction(SetPrescriptionStatusAction, null, done);
                    });
                });

            }
        } else {
            // TODO handle this error
            context.executeAction(SetPrescriptionStatusAction, null, done);
        }

    });
}

export function UpdatePrescriptionAction(context, { patientID, prescriptionID, data }, done) {
    __debug("Updating prescription %i", prescriptionID);

    context.executeAction(SetPrescriptionStatusAction, "prescribing", () => {
        context.service
            .update('PrescriptionService')
            .params({
                id: prescriptionID,
            })
            .body(data).end()
            .then(({ data }) => {

                var prescription = data;

                var complete = () => {
                    context.executeAction(UpdatePrescriptionSetAction, {
                        [patientID]: {
                            prescriptions: {
                                [prescriptionID]: data
                            }
                        }
                    }, () => {
                        context.executeAction(SetPrescriptionStatusAction, null, done);
                    });
                };

                __debug('Updating prescription %i.', prescriptionID);
                __debug(' - completed: %s', prescription.completed);
                __debug(' - dosageID: %s', prescription.dosageID);

                if(prescription.completed) {
                    context.service
                        .read('DosageService')
                        .params({
                            where: {
                                id: prescription.dosageID
                            }
                        }).end().then(({ data }) => {
                            __debug(data);
                            var dosage = data[prescription.dosageID];
                            if(dosage) {
                                context.service
                                    .update('DosageService')
                                    .params({
                                        id: dosage.id
                                    })
                                    .body({
                                        available: parseInt(dosage.available) - (prescription.amount)
                                    }).end()
                                    .then(({ data }) => {
                                        if(data) {
                                            complete();
                                        }
                                    });
                            }

                        });
                } else complete();

            });
    });

}

export function RemovePrescriptionAction(context, { patientID, prescriptionID, data }, done) {
    __debug("Removing prescription %i", prescriptionID);

    context.executeAction(SetPrescriptionStatusAction, "prescribing", () => {
        context.service
            .delete('PrescriptionService')
            .params({
                id: prescriptionID,
            })
            .end()
            .then(({ data }) => {
                if(data.status) {
                    context.executeAction(UpdatePrescriptionSetAction, {
                        [patientID]: {
                            prescriptions: {
                                [prescriptionID]: null
                            }
                        }
                    }, () => {
                        context.executeAction(SetPrescriptionStatusAction, null, done);
                    });
                } else {
                    /// TODO handle error
                    context.executeAction(SetPrescriptionStatusAction, null, done);
                }
            });
    });

}

/** ========================== **/

export function UpdatePrescriptionSetAction(context, payload, done) {
    context.dispatch(Actions.PRESCRIPTION_SET_UPDATE, payload);
    done();
}

export function ClearPrescriptionSetsAction(context, payload, done) {
    context.dispatch(Actions.PRESCRIPTION_SETS_CLEAR, payload);
    done();
}
