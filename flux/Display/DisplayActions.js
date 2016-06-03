/**
 *
 */

import debug from 'debug';

import { navigateAction } from '../Route/RouteActions';
import Actions from '../actions';
import DisplayStore from './DisplayStore';
import { JsonModel } from '../../database/helper';

const __debug = debug('forcept:flux:Display:DisplayActions');

/** ============================= **/

export function LoadDisplayGroupsAction(context, payload, done) {
    __debug(" ==> Action: LoadDisplayGroups");
    return context.service
        .read('DisplayGroupService')
        .params({}).end()
        .then(({ data }) => {
            context.dispatch(Actions.DISPLAY_GROUP_UPDATE, data);
            done();
        });
}

export function GrabDisplayGroupAction(context, { id }) {
   __debug(" ==> Action: GrabDisplayGroup (id=%s)", id);
   return context.service
       .read("DisplayGroupService")
       .params({
           where: { id: id }
       }).end()
       .then(({ data }) => {
           __debug(" | GrabDisplayGroup: grabbed group #%s", id);
           if(data.hasOwnProperty(id)) {
               context.dispatch(Actions.DISPLAY_GROUP_CACHE_UPDATE, JsonModel(data[id]));
           } else {
               throw new Error("Display group not found");
           }
           return;
       })
       .catch(err => {
           __debug("Error occurred when fetching display group %s", id);
           __debug(err);
        //    context.dispatch(Actions.STAGES_LOAD_ERROR, err);
           return;
       });
}

/** ============================= **/

export function UpdateDisplayGroupCacheAction(context, payload, done) {
    __debug(" ==> Action: UpdateDisplayGroupCache");
    context.dispatch(Actions.DISPLAY_GROUP_CACHE_MODIFIED);
    context.dispatch(Actions.DISPLAY_GROUP_CACHE_UPDATE, payload);
    done();
}

export function ClearDisplayGroupCacheAction(context, payload, done) {
    __debug(" ==> Action: ClearDisplayGroupCache");
    context.dispatch(Actions.DISPLAY_GROUP_CACHE_CLEAR);
    done();
}

export function SaveDisplayGroupAction(context, payload, done) {

    context.dispatch(Actions.CONSOLE_SET_STATUS, "saving");

    let cache = context.getStore(DisplayStore).getGroupCache();
    let id    = payload.id;
    let query;

    __debug("Saving display group '%s' to id '%s'", cache.name, id);

    if(id) {
        query = context.service
            .update('DisplayGroupService')
            .params({
                id: id
            })
            .body(cache).end();
    } else {
        query = context.service
            .create('DisplayGroupService')
            .body(cache).end();
    }

    query.then(({ data }) => {

        __debug("SaveDisplayGroup query complete.");
        __debug(" - group.id = %s", data.id);
        __debug(" - id       = %s", id);

        /// If the id has changed (the stage was created)
        if(data.id != id) {
            context.executeAction(navigateAction, {
                url: '/console/displays/' + data.id
            });
        }

        context.dispatch(Actions.CONSOLE_SET_STATUS, "saved");
        context.executeAction(LoadDisplayGroupsAction, {}, (err) => {
            done();
        });
        done();

    }).catch((err) => {
        __debug(err);
        done();
    });

}
