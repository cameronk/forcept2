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

window.$ = window.jQuery = require('jquery');
// window.console.log = window.console.error = window.console.info = function(message) {
//     var node = document.createElement("LI");
//     var textNode = document.createTextNode(message);
//     node.appendChild(textNode);
//     document.getElementById("debug").appendChild(node);
// };

require('semantic-ui/dist/semantic.js');

console.log('rehydrating app');
console.log(JSON.stringify(dehydratedState));

// pass in the dehydrated server state from server.js
app.rehydrate(dehydratedState, (err, context) => {

    if (err) {
        console.error(err);
        throw err;
    }

    window.context = context;
    const mountNode = document.getElementById('app');

    console.log('React Rendering');
    console.log(mountNode.toString());

    ReactDOM.render(
        /// Create root element with hydrated context.
        createElementWithContext(context),
        mountNode,
        () => console.log('React Rendered')
    );
});
