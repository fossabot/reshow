'use strict';
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const ENV = process.env.NODE_ENV;
let plugins = [
    new webpack.optimize.LimitChunkCountPlugin({maxChunks:1}),
];
if ('production' === ENV) {
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
                    //exclude: /node_modules/,
                    loader: "babel-loader", 
                    options:{
                        cacheDirectory:true
                    } 
                  }
            ]
        },
        plugins: plugins
    };
};

export default myWebpack;
