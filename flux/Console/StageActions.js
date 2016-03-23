/**
 * forcept - Console/StagesActions.js
 * @author Azuru Technology
 */

import Actions from '../actions';
import debug from 'debug';
import { JsonModel } from '../../database/helper';
const __debug = debug('forcept:flux:Console:StageActions');

/*
 * load stage names and IDs for list display.
 */
export function LoadStagesAction(context, payload, done) {

    let promises = [];

    /*
     * Only load if we haven't already...
     */
    if(context.getStore('StageStore').hasLoadedStages() === false) {

        __debug("Loading stage IDs and NAMEs");
        promises.push(
            context.service
                .read("StageService")
                .params({
                    where: {},
                    attributes: ['id', 'name']
                }).end()
                .then(({data}) => {
                    __debug(data);
                    context.dispatch(Actions.CONSOLE_STAGES_LOADED, data.map(stage => JsonModel(stage)));
                    return;
                })
                .catch(err => {
                    __debug("Error occurred when fetching all stages");
                    __debug(err);
                    context.dispatch(Actions.CONSOLE_STAGES_LOAD_ERROR, err);
                    return;
                })
        );

    }

    /*
     * If an ID is provided, load that stage
     */
    if(payload.hasOwnProperty('params') && payload.params.hasOwnProperty('id')) {

        context.dispatch(Actions.CONSOLE_STAGES_CLEAR_CACHE);

        __debug("Grabbing stage %s", payload.params.id);

        promises.push(
            context.service
                .read("StageService")
                .params({
                    where: {
                        id: payload.params.id
                    }
                }).end()
                .then(({data}) => {
                    context.dispatch(Actions.CONSOLE_STAGES_UPDATE_CACHE, JsonModel(data[0]));
                    return;
                })
                .catch(err => {
                    __debug("Error occurred when fetching stage %s", payload.params.id);
                    __debug(err);
                    // context.dispatch(Actions.CONSOLE_STAGES_LOAD_ERROR, err);
                    return;
                })
        );

    }

    /*
     * ...otherwise, clear the cache ("Create a new stage")
     */
    else {
        context.dispatch(Actions.CONSOLE_STAGES_CLEAR_CACHE);
    }

    Promise.all(promises).then(() => {
        done();
    })
}

export function UpdateCacheAction(context, payload, done) {
    context.dispatch(Actions.CONSOLE_STAGES_UPDATE_CACHE, payload);
}
