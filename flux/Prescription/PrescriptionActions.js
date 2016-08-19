/**
 *
 */

import debug from 'debug';

import Actions from '../actions';
import MedicationStore from '../Pharmacy/MedicationStore';
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

export function PrescribeAction(context, { patientID, setID, quantityID, medicationID }, done) {
    context.executeAction(SetPrescriptionStatusAction, "prescribing", () => {
        context.service
            .create('PrescriptionService')
            .body({
                setID: setID,
                medicationID: medicationID,
                quantityID: quantityID,
                createdBy: context.getUser('id')
            }).end()
            .then(({ data }) => {
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
    });
}

/** ========================== **/

export function UpdatePrescriptionSetAction(context, payload, done) {
    context.dispatch(Actions.PRESCRIPTION_SET_UPDATE, payload);
    done();
}
