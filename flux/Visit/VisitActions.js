/**
 *
 *
 */

import debug from 'debug';

import Actions from '../actions';

const __debug = debug('forcept:flux:Visit:VisitActions');

export function SetCurrentTabAction(context, payload, done) {
    context.dispatch(Actions.VISIT_SET_CURRENT_TAB, payload);
    done();
}
