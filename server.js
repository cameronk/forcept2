/**
 * forcept - server.js
 * @author Azuru Technology
 *
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */

/// Package imports
import React from 'react';
import ReactDOM from 'react-dom/server';
import { navigateAction } from 'fluxible-router';
import { createElementWithContext } from 'fluxible-addons-react';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import path from 'path';
import serialize from 'serialize-javascript';
import debug from 'debug';

/// Application imports
import app from './app';
import { sequelize, models } from './database/Layer';
import TestService from './services/TestService';

/// Containers
import HtmlContainer from './containers/Html';

/// Constants
const env = process.env.NODE_ENV;
const port = process.env.PORT || 3000;
const debugNamespace = process.env.DEBUG || "none";
const __debug = debug('forcept:server');

__debug("---");
__debug("Initializing Forcept server.");
__debug("  web server port  : %s", port);
__debug("  node environment : %s", env);
__debug("  console messages : %s", debugNamespace);
__debug("  models available : %s", Object.keys(models).length);
__debug("---");

/// Synchronise models before setting up express server.
sequelize.sync().then(function() {
    __debug("Models synchronized.");

    /*
     * Configure Passport local strategy.
     */
    passport.use(new LocalStrategy(
        function(username, password, cb) {
            models.User.findOne({
                where: {
                    username: username
                }
            }).then(functon(user) {
                if(!user) {
                    return cb(null, false)''
                }
                if(user.password !== password) {
                    return cb(null, false);
                }
                return cb(null, user);
            })
        }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        models.User.findOne({
            where: {
                id: id
            }
        }).then(function(user) {
            cb(null, user);
        });
    });

    /*
     * Instantiate Express and apply middleware.
     */
    const server = express();

    server.use('/public', express['static'](path.join(__dirname, '/build')));
    server.use(compression());
    server.use(bodyParser.json());
    server.use(passport.initialize());
    server.use(passport.session());

    /// Use fluxible-plugin-fetchr middleware
    const FetchrPlugin = app.getPlugin('FetchrPlugin');
          FetchrPlugin.registerService(TestService.attach(models));

    server.use(FetchrPlugin.getXhrPath(), FetchrPlugin.getMiddleware());

    /// Custom middleware for rendering html to string
    server.use((req, res, next) => {
        const context = app.createContext();

        __debug('=> %s', req.url);

        context.getActionContext().executeAction(navigateAction, {
            url: req.url
        }, (err) => {
            if (err) {
                if (err.statusCode && err.statusCode === 404) {
                    // Pass through to next middleware
                    next();
                } else {
                    next(err);
                }
                return;
            }

            // __debug('Exposing context state');
            const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

            // __debug('Rendering Root component into html');
            const markup = ReactDOM.renderToString(createElementWithContext(context));

            const htmlElement = React.createElement(HtmlContainer, {
                clientFile: env === 'production' ? 'main.min.js' : 'main.js',
                context: context.getComponentContext(),
                state: exposed,
                markup: markup
            });

            const html = ReactDOM.renderToStaticMarkup(htmlElement);

            res.type('html');
            res.write('<!DOCTYPE html>' + html);
            res.end();
        });
    });

    server.listen(port);

    __debug('Application listening on port ' + port);

});
