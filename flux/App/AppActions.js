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
