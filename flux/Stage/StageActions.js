/**
 * forcept - flux/Stage/StageActions.js
 * @author Azuru Technology
 */

import debug from 'debug';

import Actions from '../actions';
import { navigateAction } from '../Route/RouteActions';
import StageStore from './StageStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Stage:StageActions');

/*
 * load stage data [name, id] for list display.
 * Dispatches:
 *  STAGES_LOADED -> Stage/StageStore
 *  STAGES_LOAD_ERROR -> Stage/StageStore
 */
export function LoadStagesAction(context, payload, done) {
    __debug("Loading stages.");
    return context.service
        .read("StageService")
        .params({
            where: {},
            attributes: ['id', 'name']
        }).end()
        .then(({data}) => {
            __debug("...stages fetched.");
            context.dispatch(Actions.STAGES_LOADED, data.map(stage => JsonModel(stage)));
            return;
        })
        .catch(err => {
            __debug("Error occurred when fetching all stages");
            __debug(err);
            context.dispatch(Actions.STAGES_LOAD_ERROR, err);
            return;
        });
}

/*
 * Load a particular stage based on payload.id
 * Dispatches:
 *  STAGES_UPDATE_CACHE -> Stage/StageStore
 *  STAGES_LOAD_ERROR   -> Stage/StageStore
 */
export function GrabStageAction(context, { id }) {
    __debug("Grabbing stage.");
    return context.service
        .read("StageService")
        .params({
            where: { id: id }
        }).end()
        .then(({data}) => {
            __debug("...grabbed stage #%s", id);
            if(data.length > 0) {
                context.dispatch(Actions.STAGES_UPDATE_CACHE, JsonModel(data[0]));
            } else {
                throw new Error("Stage not found");
            }
            return;
        })
        .catch(err => {
            __debug("Error occurred when fetching stage %s", id);
            __debug(err);
            context.dispatch(Actions.STAGES_LOAD_ERROR, err);
            return;
        });
}

/*
 *
 */
export function ClearCacheAction(context, payload) {
   context.dispatch(Actions.STAGES_CLEAR_CACHE);
}

/*
 * Update the stage cache via payload.
 */
export function UpdateCacheAction(context, payload, done) {
    context.dispatch(Actions.STAGES_CACHE_MODIFIED);
    context.dispatch(Actions.STAGES_UPDATE_CACHE, payload);
    done();
}

/*
 * Process uploading of new fields.
 */
export function UploadFieldsAction(context, { fields }) {
    context.executeAction(UpdateCacheAction, {
        fields: null
    }, () => {
        context.executeAction(UpdateCacheAction, {
            fields: fields
        });
    });
}

/*
 * Save cached stage.
 */
export function SaveStageAction(context, payload, done) {

    context.dispatch(Actions.STAGES_SET_STATUS, "saving");

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

            context.dispatch(Actions.STAGES_SET_STATUS, "saved");
            context.executeAction(LoadStagesAction, {}, (err) => {
                done();
            });

        }).catch((err) => {
            __debug(err);
        });
}
