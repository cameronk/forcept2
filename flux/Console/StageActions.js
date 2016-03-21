/**
 * forcept - Console/StagesActions.js
 * @author Azuru Technology
 */

import Actions from '../actions';
import debug from 'debug';

const __debug = debug('forcept:flux:Console:StageActions');

/*
 * Attempt to log a user in.
 */
export function LoadStagesAction(context, payload, done) {
    __debug("Loading stages.");

    /*
     * Only load if we haven't already...
     */
    if(context.getStore('StageStore').hasLoadedStages() === false) {
        context.service
            .read("ConsoleStagesService")
            .end(function(err, stages, meta) {
                if(err) {
                    context.dispatch(Actions.CONSOLE_STAGES_LOAD_ERROR, err);
                } else {
                    context.dispatch(Actions.CONSOLE_STAGES_LOADED, stages);
                }
                done();
            });
    } else done();
    
}
