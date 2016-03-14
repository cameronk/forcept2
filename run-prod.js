/**
 * forcept - run-prod.js
 * @author Azuru Technology
 */
var shell = require('shelljs');
var __debug = console.log;

shell.env.NODE_ENV = process.env.NODE_ENV || "production";
shell.env.PORT = shell.env.PORT || 8080;
shell.env.DEBUG = "forcept:*";

__debug('Shell port: %s', (shell.env.PORT || 8080));

shell.exec('node start.js', function () {});
