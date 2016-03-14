/**
 * forcept - run-dev.js
 * @author Azuru Technology
 */

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var shell = require('shelljs');
require('./utils/GetLocalIP');
var __debug = console.log;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    quiet: true,
    // noInfo: false,
    proxy: {
        '*': { target: 'http://localhost:3001' }
    }
}).listen(3000, '0.0.0.0', function () {

    shell.env.PORT = shell.env.PORT || 3001;
    shell.env.DEBUG = "forcept:*";

    __debug('Shell port: %s', (shell.env.PORT || 3001));

    shell.exec('"./node_modules/.bin/nodemon" start.js -e js,jsx', function () {});
    __debug('Webpack Dev Server listening on port 3000');

});
