/**
 * forcept - flux/App/AppActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import Actions from '../actions';

const __debug = debug('forcept:flux:App:AppActions');

export default function SetLoadingModeAction(context, payload, done) {

    // let type = typeof payload;
    //
    // /// Check if this is just the mode
    // if(type === "string") {
    //     context.dispatch(Actions.APP_SET_LOADING_MODE, payload);
    // } else {
    //
    //     /// Split object properties into separate dispatches
    //     if(type === "object" && payload !== null) {
    //         context.dispatch(Actions.APP_SET_LOADING_MODE, payload.mode || "default");
    //         context.dispatch(Actions.APP_SET_LOADING_CONTAINER, payload.container || "#Handler");
    //     }
    //
    // }
    done();
}
