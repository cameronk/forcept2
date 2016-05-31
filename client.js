/**
 * forcept - client.js
 * @author Azuru Technology
 */

/*global document, window */

import ReactDOM from 'react-dom';
import debug from 'debug';
import { createElementWithContext } from 'fluxible-addons-react';
import { loadIntlPolyfill, loadLocaleData } from './utils/IntlPolyfillClient';

const dehydratedState = window.App; // Sent from the server

/*
 * Give debug access to page console
 */
localStorage.debug = 'forcept:*';

window.React = ReactDOM; // For chrome dev tool support
window.$ = window.jQuery = require('jquery');

window.console.log = window.console.error = window.console.info = function(message) {
    var node = document.createElement("LI");
    var textNode = document.createTextNode(message);
    node.appendChild(textNode);
    document.getElementById("debug").appendChild(node);
};

function renderApp() {

    const app = require('./app');

    require('semantic-ui/dist/semantic.js');

    // pass in the dehydrated server state from server.js
    app.rehydrate(dehydratedState, (err, context) => {

        if (err) {
            console.error(err);
            throw err;
        }

        window.context = context;
        const mountNode = document.getElementById('app');

        ReactDOM.render(
            /// Create root element with hydrated context.
            createElementWithContext(context),
            mountNode
        );
    });

};

const locale = document.documentElement.getAttribute("lang");

loadIntlPolyfill(locale)
    .then(loadLocaleData.bind(null, locale))
    .then(renderApp)
    .catch(err => {
        console.error(err);
    });
