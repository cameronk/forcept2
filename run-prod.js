/**
 * forcept - run-prod.js
 * @author Azuru Technology
 */
var shell = require('shelljs');
var __debug = console.log;
var getConfig = require('./utils/GetConfig');

getConfig(function(config) {

    shell.env.NODE_ENV = (process.env.NODE_ENV || "production");
    shell.env.PORT = (config.port || 8080);
    shell.env.DEBUG = "forcept:*";

    __debug('run-prod: preparing to broadcast on port ' + shell.env.PORT);
    
    shell.exec('node start.js', function () {});

});
