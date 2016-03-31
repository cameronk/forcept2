/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import debug from 'debug';

import StageStore from '../Stage/StageStore';
import { LoadStagesAction, GrabStageAction, ClearCacheAction } from '../Stage/StageActions';
import { GrabVisitAction } from '../Visit/VisitActions';

var __debug = debug('forcept:flux:Route:RouteActions');

/*
 * Dispatch actions handled during *every* page load.
 *
 * Expected payload: routeStore.getCurrentRoute()
 * Dispatches:
 *  STAGES_CLEAR_CACHE -> Stage/StageStore
 */
var RunPageLoadActions = function(context, payload, done) {

    let promises = [];

    /*
     * Clear stage cache every page load.
     */
    // promises.push(
        context.executeAction(ClearCacheAction);
    // );

    /*
     * If stages name/ID list has not been loaded
     * grab it from the database now.
     */
    if(context.getStore(StageStore).hasLoadedStages() === false) {

        __debug("Loading stage IDs and NAMEs");
        promises.push(
            context.executeAction(LoadStagesAction)
        );

    }

    /*
     * Automagically cache stage data if a stageID parameter is provided.
     */
    if(payload.hasOwnProperty('params')) {

        /**
         * Load stage if stageID parameter was given.
         */
        if(payload.params.hasOwnProperty('stageID')) {

            promises.push(
                context.executeAction(GrabStageAction, {
                    id: payload.params.stageID.split("-")[0]
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

    __debug("Executing %s promises prior to load.", promises.length);

    /*
     * Run all promises before returning done()
     */
    Promise.all(promises).then(() => {
        done();
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
    context.executeAction(RunPageLoadActions, route, (err) => {

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
