/**
 * forcept - flux/Stage/StageActions.js
 * @author Azuru Technology
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';

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

    __debug(" ==> Action: LoadStages");

    return context.service
        .read("StageService")
        .params({
            order: ['order']
        }).end()
        .then(({ data }) => {
            __debug(" | LoadStages: stages fetched.");
            context.dispatch(
                Actions.STAGES_LOADED,
                keyBy(data, 'id')
            );
            done();
            return;
        })
        .catch(err => {
            __debug("Error occurred when fetching all stages");
            __debug(err);
            context.dispatch(Actions.STAGES_LOAD_ERROR, err);
            done();
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
    __debug(" ==> Action: GrabStage (id=%s)", id);
    return context.service
        .read("StageService")
        .params({
            where: { id: id }
        }).end()
        .then(({ data }) => {
            __debug(" | GrabStage: grabbed stage #%s", id);
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
export function ClearCacheAction(context, payload, done) {
    __debug(" ==> Action: ClearCache");
    context.dispatch(Actions.STAGES_CLEAR_CACHE);
    done();
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

    context.dispatch(Actions.CONSOLE_SET_STATUS, "saving");

    let cache = context.getStore(StageStore).getCache();
    let id    = payload.id;
    let query;

    __debug("Saving stage '%s' to id '%s'", cache.name, id);

    if(id) {
        query = context.service
            .update('StageService')
            .params({
                id: id
            })
            .body(cache).end();
    } else {
        query = context.service
            .create('StageService')
            .body(cache).end();
    }

    query.then(({ data }) => {

        __debug("SaveStage query complete.");
        __debug(" - stage.id = %s", data.id);
        __debug(" - id       = %s", id);

        /// If the id has changed (the stage was created)
        if(data.id != id) {
            context.executeAction(navigateAction, {
                url: '/console/stages/' + data.id
            });
        }

        context.dispatch(Actions.STAGES_SET_STATUS, "saved");
        context.executeAction(LoadStagesAction, {}, (err) => {
            done();
        });
        done();

    }).catch((err) => {
        __debug(err);
        done();
    });

}
