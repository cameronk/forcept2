/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import debug from 'debug';

var __debug = debug('forcept:flux:Route:RouteActions');

var navigateAction = function navigateAction(context, payload, done) {

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

    // __debug('dispatching NAVIGATE_START', navigate);
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
}

navigateAction.displayName = 'navigateAction';

export var navigateAction;
