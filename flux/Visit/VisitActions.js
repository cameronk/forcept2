/**
 *
 *
 */

import debug from 'debug';

import Actions from '../actions';

const __debug = debug('forcept:flux:Visit:VisitActions');

/*
 * Update the stage cache via payload.
 */
export function UpdateCacheAction(context, payload, done) {
    context.dispatch(Actions.VISIT_CACHE_MODIFIED);
    context.dispatch(Actions.VISIT_UPDATE_CACHE, payload);
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
        .end()
        .then(({data}) => {
            __debug("Patient created:");
            __debug(data);
            context.dispatch(Actions.APP_LOADING, false);
            context.dispatch(Actions.PATIENT_UPDATE, {
                [data.id]: data
            });
            context.dispatch(Actions.VISIT_SET_CURRENT_TAB, data.id);
            done();
        });
}
