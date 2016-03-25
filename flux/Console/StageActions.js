/**
 * forcept - Console/StagesActions.js
 * @author Azuru Technology
 */

import debug from 'debug';

import Actions from '../actions';
import { navigateAction } from '../Route/RouteActions';
import StageStore from './StageStore';
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
                    // __debug(data);
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
                    __debug("Grab data:")
                    __debug(data);
                    if(data.length > 0) {
                        context.dispatch(Actions.CONSOLE_STAGES_UPDATE_CACHE, JsonModel(data[0]));
                    } else {
                        throw new Error("Stage not found");
                    }
                    return;
                })
                .catch(err => {
                    __debug("Error occurred when fetching stage %s", payload.params.id);
                    __debug(err);
                    context.dispatch(Actions.CONSOLE_STAGES_LOAD_ERROR, err);
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

/*
 * Update the stage cache via payload.
 */
export function UpdateCacheAction(context, payload, done) {
    context.dispatch(Actions.CONSOLE_STAGES_CACHE_MODIFIED);
    context.dispatch(Actions.CONSOLE_STAGES_UPDATE_CACHE, payload);
}

/*
 * Save cached stage.
 */
export function SaveStageAction(context, payload, done) {

    context.dispatch(Actions.CONSOLE_STAGES_SET_STATUS, "saving");

    let cache = context.getStore(StageStore).getCache();
    let id    = payload.id;

    __debug("Saving stage '%s' to id '%s'", cache.name, id);

    context.service
        .update('StageService')
        .params({
            id: id
        })
        .body(cache).end()
        .then(response => {

            /// If ID was initially unset...
            if(!id && response.data.id) {
                context.executeAction(navigateAction, {
                    url: '/console/stages/' + response.data.id
                });
            }

            context.dispatch(Actions.CONSOLE_STAGES_SET_STATUS, "saved");
            done();

        }).catch((err) => {
            __debug(err);
        });
}

/*
 * Set the current option shift context.
 */
export function SetOptionShiftContext(context, payload, done) {
    context.dispatch(Actions.CONSOLE_STAGES_SET_OPTION_SHIFT_CONTEXT, payload);
}
