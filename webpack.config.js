var webpack = require('webpack');
var path = require('path');

var webpackConfig = {
    resolve: {
        extensions: ['', '.js', '.jsx', '.less', '.css']
    },
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './client.js'
    ],
    output: {
        path: path.resolve('./dist'),
        publicPath: '/public/',
        filename: 'dev.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    require.resolve('react-hot-loader'),
                    require.resolve('babel-loader'),
                ]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
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
        setImmediate: false
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                BROWSER: JSON.stringify(true)
            }
        })
    ],
    devtool: 'eval'
};

module.exports = webpackConfig;
