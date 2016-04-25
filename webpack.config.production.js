var webpack = require('webpack');
var path = require('path');
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackConfig = {
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    },
    entry: [
        './client.js'
    ],
    output: {
        path: path.resolve('./dist'),
        publicPath: '/public/',
        filename: '[name]-[chunkhash].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    require.resolve('react-hot-loader'),
                    require.resolve('babel-loader')
                ]
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test:   /\.(png|gif|jpe?g|svg)$/i,
                loader: 'url',
                query: {
                    limit: 10000,
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=dist/fonts/[name].[ext]'
            }
        ]
    },
    node: {
        setImmediate: ,
        fs: "empty"
    },
    plugins: [
        // css files from the extract-text-plugin loader
        new ExtractTextPlugin("[name]-[chunkhash].css"),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                BROWSER: JSON.stringify(true)
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        // Write out stats.json file to build directory.
        new StatsWriterPlugin({
            transform: function (data) {
                return JSON.stringify({
                    js: data.assetsByChunkName.main[0],
                    css: data.assetsByChunkName.main[1]
                }, null, 2);
            }
        })
    ]
};

module.exports = webpackConfig;
