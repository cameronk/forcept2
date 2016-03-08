/**
 * forcept - client.js
 * @author Azuru Technology
 */

/*global document, window */

import ReactDOM from 'react-dom';
import debug from 'debug';
import { createElementWithContext } from 'fluxible-addons-react';

import app from './app';

const __debug = debug('forcept:client');
const dehydratedState = window.App; // Sent from the server

window.React = ReactDOM; // For chrome dev tool support

// expose debug object to browser, so that it can be enabled/disabled from browser:
// https://github.com/visionmedia/debug#browser-support
window.fluxibleDebug = debug;

__debug('rehydrating app');

// pass in the dehydrated server state from server.js
app.rehydrate(dehydratedState, (err, context) => {

    if (err) throw err;

    window.context = context;
    const mountNode = document.getElementById('app');

    __debug('React Rendering');

    ReactDOM.render(
        /// Create root element with hydrated context.
        createElementWithContext(context),
        mountNode,
        () => __debug('React Rendered')
    );
});
