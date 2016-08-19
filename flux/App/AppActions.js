/**
 * forcept - flux/App/AppActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import Actions from '../actions';

const __debug = debug('forcept:flux:App:AppActions');

/**
 * Flash application data to the page.
 * Parameters: [mirrors MessageScaffold props]
 */
export function FlashAppDataAction(context, payload, done) {
    __debug(" ==> Action: FlashAppData");
    context.dispatch(Actions.APP_FLASH, payload);
    done();
}

export function SetAppStatusAction(context, payload, done) {
    context.dispatch(Actions.APP_SET_STATUS, payload);
    done();
}

export function UpdateConfigAction(context, payload, done) {
    context.dispatch(Actions.APP_UPDATE_CONFIG, payload);
    done();
}

export function SaveConfigAction(context, { current, changes }, done) {
    context.service
        .update('AppService')
        .body({
            current: current,
            changes: changes
        }).end()
        .then(itWorked => {
            if(itWorked) {
                context.dispatch(Actions.APP_CONFIG_CHANGED, true);
                done();
            }
        });
}

export function FatalErrorAction(context, error, done) {
    context.dispatch('NAVIGATE_ERROR', error);
    done();
}
