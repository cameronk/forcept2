/**
 *
 */

import debug from 'debug';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';

import Actions from '../actions';
import { navigateAction } from '../Route/RouteActions';
import DisplayStore from './DisplayStore';
import { JsonModel } from '../../database/helper';
import { SetConsoleStatusAction } from '../Console/ConsoleActions';

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

export function GrabDisplayGroupAction(context, { id }, done) {
    __debug(" ==> Action: GrabDisplayGroup (id=%s)", id);
    return context.service
        .read("DisplayGroupService")
        .params({
            where: { id: id }
        }).end()
        .then(({ data }) => {
            __debug(" | GrabDisplayGroup: grabbed group #%s", id);
            if(data.hasOwnProperty(id)) {
                var group = JsonModel(data[id]);

                return context.service
                    .read("DisplayService")
                    .params({
                        where: {
                            group: group.id
                        }
                    }).end()
                    .then(({ data }) => {
                        group.displays = data;
                        context.dispatch(Actions.DISPLAY_GROUP_CACHE_UPDATE, group);
                        done();
                    });

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

    var cache = context.getStore(DisplayStore).getGroupCache();
    var withoutDisplays = omit(cache, ["displays"]);

    let promises = [];
    let id    = payload.id;
    let query;

    __debug("Saving display group '%s' to id '%s'", cache.name, id);

    if(id) {
        query = context.service
            .update('DisplayGroupService')
            .params({
                id: id
            })
            .body(withoutDisplays).end();
    } else {
        query = context.service
            .create('DisplayGroupService')
            .body(withoutDisplays).end();
    }

    query.then(({ data }) => {

        var groupRecordID = data.id;

        __debug("SaveDisplayGroup query complete.");
        __debug(" - group.id = %s", groupRecordID);
        __debug(" - id       = %s", id);

        var promises = [];

        if(cache.displays) {
            for(var display in cache.displays) {
                let thisDisplay = cache.displays[display];
                promises.push(
                    context.service
                        .update('DisplayService')
                        .params({
                            id: thisDisplay.id
                        }).body(omit(thisDisplay, ['id', 'group'])).end()
                );
            }
        }

        Promise.all(promises).then(() => {


            /// If the id has changed (the stage was created)
            if(groupRecordID != id) {
                context.executeAction(navigateAction, {
                    url: '/console/displays/' + groupRecordID
                });
            }

            context.dispatch(Actions.CONSOLE_SET_STATUS, "saved");
            context.executeAction(LoadDisplayGroupsAction, {}, (err) => {
                done();
            });

        });

    }).catch((err) => {
        __debug(err);
        done();
    });

}

/** ============================= **/

export function CreateDisplayAction(context, { groupID, type, name, settings }, done) {
    context.executeAction(SetConsoleStatusAction, "creating")
        .then(() => {

            var body = {
                group: groupID,
                name: name,
                type: type,
                settings: settings
            };

            __debug("Creating a new display: %j", body);
            context.service
                .create("DisplayService")
                .body(body)
                .end().then(({ data }) => {
                    context.executeAction(UpdateDisplayGroupCacheAction, {
                        displays: {
                            [data.id]: data
                        }
                    }).then(() => {
                        return context.executeAction(SetConsoleStatusAction, "created");
                    }).then(() => done());
                });
        });
}
