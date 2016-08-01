/**
 * forcept - run-dev.js
 * @author Azuru Technology
 */

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var configureWebpack = require('./webpack.config');
var shell = require('shelljs');
var __debug = console.log;
var getConfig = require('./utils/GetConfig');

getConfig(function(config) {

    const webpackPort = (config.devPort || 3000);
    const expressPort = (webpackPort + 1);
    const webpackConfig = configureWebpack(webpackPort);

    __debug("run-dev: webpack port = " + webpackPort);
    __debug("run-dev: express port = " + expressPort);

    new WebpackDevServer(webpack(webpackConfig), {
        publicPath: webpackConfig.output.publicPath,
        hot: true,
        historyApiFallback: true,
        quiet: false,
        noInfo: true,
        proxy: {
            '*': { target: 'http://localhost:' + expressPort }
        }
    }).listen(webpackPort, '0.0.0.0', function () {

        shell.env.PORT = expressPort;
        shell.env.DEBUG = "forcept:*";

        shell.exec('"./node_modules/.bin/nodemon" start.js -e js,jsx', function () {});
        __debug('run-dev: Webpack Dev Server listening on port ' + webpackPort);

    });
});
