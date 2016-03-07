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
import path from 'path';
import serialize from 'serialize-javascript';
import debug from 'debug';

/// Application imports
import app from './app';
import models from './database/Models';
import TestService from './services/TestService';

/// Containers
import HtmlComponent from './containers/Html';

const env = process.env.NODE_ENV;
const __debug = debug('forcept:server');

/// Synchronise models before setting up express server.
let promises = [];
for(var name in Models) {
    promises.push(Models[name].sync());
}

Promise.all(promises)
    .then(function() {

        const server = express();

        server.use('/public', express['static'](path.join(__dirname, '/build')));
        server.use(compression());
        server.use(bodyParser.json());

        /// Use fluxible-plugin-fetchr middleware
        const FetchrPlugin = app.getPlugin('FetchrPlugin');

        FetchrPlugin.registerService(TestService);
        FetchrPlugin.updateOptions({
            context: {
                models: Models
            }
        });

        server.use(FetchrPlugin.getXhrPath(), FetchrPlugin.getMiddleware());

        server.use((req, res, next) => {
            const context = app.createContext();

            __debug('Executing navigate action');
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

                __debug('Exposing context state');
                const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

                __debug('Rendering Root component into html');
                const markup = ReactDOM.renderToString(createElementWithContext(context));

                const htmlElement = React.createElement(HtmlComponent, {
                    clientFile: env === 'production' ? 'main.min.js' : 'main.js',
                    context: context.getComponentContext(),
                    state: exposed,
                    markup: markup
                });
                const html = ReactDOM.renderToStaticMarkup(htmlElement);

                __debug('Sending markup');
                res.type('html');
                res.write('<!DOCTYPE html>' + html);
                res.end();
            });
        });

        const port = process.env.PORT || 3000;
        server.listen(port);
        __debug('Application listening on port ' + port);

    });
