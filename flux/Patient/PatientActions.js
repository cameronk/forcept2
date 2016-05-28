/**
 * forcept - flux/Patient/PatientActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import Actions from '../actions';

const __debug = debug('forcept:flux:Patient:PatientActions');

/**
 *
 */
export function UpdatePatientAction(context, payload, done) {
    context.dispatch(Actions.PATIENT_UPDATE, payload);
    context.dispatch(Actions.VISIT_SET_MODIFIED, true);
    done();
}

/**
 *
 */
export function ClearAllPatientsAction(context, payload, done) {
    __debug(" ==> Action: ClearAllPatients");
    context.dispatch(Actions.PATIENT_CLEAR_ALL);
    done();
}
