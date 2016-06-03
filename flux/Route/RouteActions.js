/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import debug from 'debug';

import Actions from '../actions';
import StageStore from '../Stage/StageStore';
import DisplayStore from '../Display/DisplayStore';

import { FlashAppDataAction } from '../App/AppActions';
import { ClearAllPatientsAction } from '../Patient/PatientActions';
import { LoadStagesAction, GrabStageAction, ClearCacheAction as ClearStageCacheAction } from '../Stage/StageActions';
import { ClearVisitAction, GrabVisitAction, SetRecentVisitDataAction } from '../Visit/VisitActions';
import { LoadDisplayGroupsAction, GrabDisplayGroupAction, ClearDisplayGroupCacheAction } from '../Display/DisplayActions';
import { SetConsoleStatusAction } from '../Console/ConsoleActions';

var __debug = debug('forcept:flux:Route:RouteActions');

/*
 * Dispatch actions handled during *every* page load.
 *
 * Expected payload: routeStore.getCurrentRoute()
 * Dispatches:
 *  STAGES_CLEAR_CACHE -> Stage/StageStore
 */
var PreNavigateActions = function(context, payload, done) {

    __debug("==[ PreNavigateActions ]==");
    __debug("| Running clears.");
    __debug("|=========================|");

    /*
     * This must be done first in order to ensure that the action
     * doesn't clear *after* the execution of LoadStagesAction.
     */
    Promise.all([

        /*
         * "Flash data" is intended to be per-request (per-page-view),
         * so we should clear it every time the page changes.
         */
        context.executeAction(FlashAppDataAction, false),

        /*
         * The stage cache holds data regarding a stage's fields
         * before the stage's record model is updated.
         *
         * It should be cleared on every page change so that
         * data entered for one stage doesn't carry over to another.
         */
        context.executeAction(ClearStageCacheAction),

        /*
         * The display group cache holds data about a
         * display group before it is saved to the database
         *
         * It should be cleared on every page change so that
         * data entered for one group doesn't carry over to another.
         */
        context.executeAction(ClearDisplayGroupCacheAction),

        /*
         * The console status maintains the "status" of the current
         * builder page ("saving", "saved", etc), which needs to be reset
         * when the page changes.
         */
        context.executeAction(SetConsoleStatusAction, null),

        /*
         * VisitStore maintains data about the visit
         * currently in question. When the page changes,
         * we clear this data to ensure new visit data
         * can be populated.
         */
        context.executeAction(ClearVisitAction),

        /*
         * "Recent visit data" contains stage information stored after
         * a visit is moved to a different stage, in order to provide the
         * user a quick + easy link to follow the visit they just handled.
         */
        context.executeAction(SetRecentVisitDataAction, null),

        /*
         * PatientStore maintains data about
         * the patients in a visit. Thus, we should clear
         * patients out between page loads.
         */
        context.executeAction(ClearAllPatientsAction)

    ]).then(() => {

        __debug("|=========================|");
        __debug("| Clearing actions completed.");

        let promises = [];

        /*
         * If stages name/ID list has not been loaded, grab it from the database now.
         *
         * Very important!
         */
        if(context.getStore(StageStore).hasLoadedStages() === false) {

            promises.push(
                context.executeAction(LoadStagesAction)
            );

        }

        /*
         * If display groups name/ID list has not been loaded, grab it from the database now.
         *
         * Very important!
         */
        if(context.getStore(DisplayStore).hasLoadedGroups() === false) {

            promises.push(
                context.executeAction(LoadDisplayGroupsAction)
            );

        }

        /*
         * Automagically cache stage data if a stageID parameter is provided.
         */
        if(payload.hasOwnProperty('params')) {

            /*
             * Load stage if stageID parameter was given.
             */
            if(payload.params.hasOwnProperty('stageID')) {

                /*
                 * Grab the stage in question by splitting the stage slug
                 * by dashes ("1-check-in") and getting the first array element
                 * (which is the stage ID)
                 */
                promises.push(
                    context.executeAction(GrabStageAction, {
                        id: payload.params.stageID.split("-")[0]
                    })
                );

            }

            /**
             *
             */
            if(payload.params.hasOwnProperty('groupID')) {

                promises.push(
                    context.executeAction(GrabDisplayGroupAction, {
                        id: payload.params.groupID.split("-")[0]
                    })
                );

            }

            /**
             *
             */
            if(payload.params.hasOwnProperty('visitID') && !isNaN(payload.params.visitID)) {

                promises.push(
                    context.executeAction(GrabVisitAction, {
                        id: payload.params.visitID
                    })
                );

            }

        }

        __debug("| Executing %s promises prior to load.", promises.length);

        /*
         * Run all promises before returning done()
         */
        Promise.all(promises).then(() => {
            done();
        }).catch(err => {
            // TODO: dispatch error and continue loading
            done();
        });

    });

}

var navAction = function navigateAction(context, payload, done) {

    var request = context.getRequest();
    var routeStore = context.getStore('RouteStore');

    var navigate = Object.assign({
        url: request.url,
        transactionId: context.rootId
    }, payload);

    if (!payload.url && payload.routeName) {
        navigate.url = routeStore.makePath(payload.routeName, payload.params);
        navigate.routeName = null;
    }

    context.dispatch('NAVIGATE_START', navigate);

    if (!routeStore.getCurrentRoute) {
        done(new Error('RouteStore has not implemented `getCurrentRoute` method.'));
        return;
    }

    var route = routeStore.getCurrentRoute();

    if (!route) {
        var error404 = {
            transactionId: navigate.transactionId,
            statusCode: 404,
            message: 'Url \'' + navigate.url + '\' does not match any routes'
        };

        context.dispatch('NAVIGATE_FAILURE', error404);
        done(Object.assign(new Error(), error404));
        return;
    }

    /*
     * Add custom NAVIGATE_FAILURE handler that fires
     * if the page is protected, and the user isn't
     * logged in.
     */
    var requiresAuth = route.auth;
    if('boolean' === typeof requiresAuth && requiresAuth && !context.isAuthenticated()) {

        __debug('URL %s requires authentication.', navigate.url);

        /// Error if req does not exist, isAuthenticated does not exist,
        /// or if isAuthenticated === false
        if(!navigate.req || !navigate.req.isAuthenticated) {
            var error401 = {
                transactionId: navigate.transactionId,
                statusCode: 401,
                message: 'Url \'' + navigate.url + '\' requires valid user login.'
            };

            context.dispatch('NAVIGATE_FAILURE', error401);
            done(Object.assign(new Error(), error401));
            return;
        }

    }

    /*
     * Execute actions required for page load first.
     */
    context.executeAction(PreNavigateActions, route, (err) => {

        __debug("Page-load actions done.");

        /*
         * Run action specified by route.
         */
        var action = route.action;
        if ('string' === typeof action && context.getAction) {
            action = context.getAction(action);
        }

        if (!action || 'function' !== typeof action) {
            __debug('route has no action, dispatching without calling action');
            context.dispatch('NAVIGATE_SUCCESS', route);
            done();
            return;
        }

        __debug('executing route action');
        context.executeAction(action, route, function (err) {
            if (err) {
                var error500 = {
                    transactionId: navigate.transactionId,
                    statusCode: err.statusCode || 500,
                    message: err.message
                };

                context.dispatch('NAVIGATE_FAILURE', error500);
                done(Object.assign(err, error500));
            } else {
                context.dispatch('NAVIGATE_SUCCESS', route);
                done();
            }
        });

    });
}

navAction.displayName = 'navigateAction';

export var navigateAction = navAction;
