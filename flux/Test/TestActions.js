/**
 *
 */

import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Test:TestActions');

export function PushModelAction(context, payload, done) {
    context.service
        .read('TestService')
        .end().then(({data}) => {
            __debug(typeof data);
            __Debug(typeof data[0].set);
            __debug(data);
            context.dispatch(Actions.TEST_PUSH_MODEL, data[0]);
        });
}

export function UpdateModelAction(context, payload, done) {
    context.dispatch(Actions.TEST_UPDATE_MODEL, payload);
}
