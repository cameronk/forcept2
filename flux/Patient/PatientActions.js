/**
 * forcept - flux/Patient/PatientActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import Actions from '../actions';

import { SetVisitModifiedStateAction } from '../Visit/VisitActions';

const __debug = debug('forcept:flux:Patient:PatientActions');

/*
 * Push patient data into the store via PATIENT_UPDATE
 * (Use this to push data without setting the modified state to TRUE)
 *
 *
 */
export function PushPatientDataAction(context, payload, done) {
    context.dispatch(Actions.PATIENT_UPDATE, payload);
    done();
}

/*
 *
 */
export function UpdatePatientAction(context, payload, done) {
    Promise.all([
        context.executeAction(PushPatientDataAction, payload),
        context.executeAction(SetVisitModifiedStateAction, true)
    ]).then(done);
}

/**
 *
 */
export function ClearAllPatientsAction(context, payload, done) {
    __debug(" ==> Action: ClearAllPatients");
    context.dispatch(Actions.PATIENT_CLEAR_ALL);
    done();
}
