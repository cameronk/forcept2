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
import { createElementWithContext } from 'fluxible-addons-react';
import express from 'express';
import session from 'express-session';
import connectSQLite from 'connect-sqlite3';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import path from 'path';
import serialize from 'serialize-javascript';
import debug from 'debug';

/// Application imports
import app from './app';
import db from './database/models';
import UpdateStageDefinition from './database/StageDefinition';
import { RunPageLoadActions } from './flux/App/AppActions';
import { navigateAction } from './flux/Route/RouteActions';

/// Services
import AuthService from './flux/Auth/AuthService';
import StageService from './flux/Stage/StageService';
import PatientService from './flux/Patient/PatientService';
import VisitService from './flux/Visit/VisitService';
import TestService from './flux/Test/TestService';
import RecordService from './flux/Record/RecordService';
import ResourceService from './flux/Resource/ResourceService';

/// Containers
import HtmlContainer from './containers/Html';

/// Constants
const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 3000;
const debugNamespace = process.env.DEBUG || "none";
const __debug = debug('forcept:server');
const SQLiteStore = connectSQLite(session);

__debug("---");
__debug("Initializing Forcept server.");
__debug("  web server port  : %s", port);
__debug("  node environment : %s", env);
__debug("  console messages : %s", debugNamespace);
__debug("---");

/*
 * Synchronise models before setting up express server.
 */
(db.sequelize).sync().then(() => {

    __debug("Database synchronized.");

    db.RecordModels = {}; // "Patient" => 1
    db.Record  = (function(model) {
        if(this.RecordModels.hasOwnProperty(model)) {
            return this.sequelize.models[model];
        } else {
            throw new Error(`Record ${model} not defined.`);
            return;
        }
    }.bind(db));

    /*
     * Get all stages, update Sequelize stage definitions accordingly.
     *
     */
    db.Stage.findAll().then(stages => {

        stages.map(stage => {
            UpdateStageDefinition(stage, db);
        });

        __debug("Available models:");
        __debug(Object.keys(db.sequelize.models));
        __debug(db.RecordModels);

        /*
         * Configure Passport local strategy.
         */
        passport.use(new LocalStrategy(
            function(username, password, cb) {
                db.User.findOne({
                    where: {
                        username: username
                    }
                }).then(function(user) {
                    if(!user) {
                        return cb(null, false);
                    }
                    if(user.password !== password) {
                        return cb(null, false);
                    }
                    return cb(null, user);
                });
            }
        ));

        passport.serializeUser(function(user, cb) {
            cb(null, user.id);
        });

        passport.deserializeUser(function(id, cb) {
            db.User.findOne({
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

        server.use('/public', express['static'](path.join(__dirname, '/dist')));
        server.use('/public', express['static'](path.join(__dirname, '/node_modules')));
        server.use('/resources', express['static'](path.join(__dirname, '/storage/resources')));
        server.use(compression());
        server.use(cookieParser());
        server.use(bodyParser.json());
        server.use(session({
            store: new SQLiteStore({
                dir: './storage'
            }),
            secret: 'keyboard dog',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }
        }));
        server.use(passport.initialize());
        server.use(passport.session());

        /*
         * Use fluxible-plugin-fetchr middleware
         */
        const FetchrPlugin = app.getPlugin('FetchrPlugin');
              FetchrPlugin.registerService(AuthService.attach(db));
              FetchrPlugin.registerService(StageService.attach(db));
              FetchrPlugin.registerService(PatientService.attach(db));
              FetchrPlugin.registerService(VisitService.attach(db));
              FetchrPlugin.registerService(RecordService.attach(db));
              FetchrPlugin.registerService(ResourceService.attach(db));
              FetchrPlugin.registerService(TestService.attach(db));

        server.use(FetchrPlugin.getXhrPath(), FetchrPlugin.getMiddleware());

        /*
         * Custom middleware for rendering html to string
         */
        server.use((req, res, next) => {

            const isAuthenticated = req.isAuthenticated();
            const context = app.createContext({

                /*
                 * Add auth-related pieces to be parsed by plugin.
                 */
                isAuthenticated: isAuthenticated,
                user: req.user,

                /*
                 * Build a request object of data we need so
                 * we don't have to serialize the behemoth object.
                 */
                req: {
                    url: req.url,
                    method: req.method,
                }

            });

            const thisContext   = context.getActionContext();
            const routeStore    = thisContext.getStore('RouteStore');
            const route         = routeStore.getRoute(req.url);

            if(route) {
                __debug('=> %s %s', req.method.toUpperCase(), req.url);
                __debug('| Request from  : %s', req.ip);
                __debug('| Request to    : %s', req.hostname);
                __debug('| Requires auth : %s', route.auth || false);
                __debug('| Sign in status: %s', req.isAuthenticated());

                /*
                 * Override request if it needs authentication.
                 */
                if(route.auth && !isAuthenticated) {
                    __debug('| =>  Redirecting to login...');
                    res.redirect('/auth/login');
                    res.end();
                    return;
                }

                /*
                 * Override request if we can't be here when authenticated (login page)
                 */
                if(route.antiAuth && isAuthenticated) {
                    __debug('| =>  Redirecting to index...');
                    res.redirect('/');
                    res.end();
                    return;
                }

                /*
                 * If this page requires admin protection, hide it if necessary
                 */
                if(route.admin && !req.user.isAdmin) {
                    __debug('| =>  Redirecting to login...');
                    res.redirect('/auth/login');
                    res.end();
                    return;
                }
            }

            /*
             * Run the navigateAction so that route information is built + dispatched.
             */
            thisContext.executeAction(navigateAction, {}, (err) => {

                if (err) {
                    if (err.statusCode && err.statusCode === 404) {
                        // Pass through to next middleware
                        next();
                    } else {
                        next(err);
                    }
                    return;
                }

                const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';
                const markup = ReactDOM.renderToString(createElementWithContext(context));
                const htmlElement = React.createElement(HtmlContainer, {
                    assets: env === 'production' ? require('./dist/stats.json') : { js: "dev.js" },
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

});
