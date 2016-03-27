/**
 * forcept - start.js
 * @author Azuru Technology
 */

require('babel/register');

/* Polyfill Intl for node.js if necessary. */
require('./utils/IntlPolyfillServer');

module.exports = require('./server');
