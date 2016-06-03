/**
 *
 */

import Actions from '../actions';

export function SetConsoleStatusAction(context, payload, done) {
    context.dispatch(Actions.CONSOLE_SET_STATUS, payload);
    done();
}
