'use strict';
const webpack = require('webpack');
const externals = require('./webpack.externals');

const {
    UglifyJsPlugin,
    LimitChunkCountPlugin
} = webpack.optimize;
const {
    NODE_ENV
} = process.env;
let plugins = [
    new LimitChunkCountPlugin({maxChunks:1}),
];
if ('production' === NODE_ENV) {
    plugins = plugins.concat([
        new webpack.DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify('production'),
            '__DEVTOOLS__': false
          }
        }),
        new UglifyJsPlugin({
            compress: { warnings: false},
            comments: false
        }),
    ]);
}

const myWebpack = (root, main='./build/src/server.js')=>
{
    return {
        entry: {
           node: main,
        },
        output: {
            filename: "[name].bundle.js",
            path: root + "/assets"
        },
        node: {
            fs: "empty",
        },
        externals: externals,
        resolve: {
            extensions: ['.js','.jsx']
        },
        resolveLoader: {
            modules: [root + '/node_modules']
        },
        module: {
            loaders: [
                  { 
                    test: /(.js|.jsx)$/, 
                    exclude: /node_modules/,
                    loader: "babel-loader", 
                    options:{
                        cacheDirectory: true
                    } 
                  }
            ]
        },
        plugins: plugins
    };
};

module.exports=myWebpack;
