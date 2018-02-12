'use strict';
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const BundleTracker = require('./webpackBundleTracker');
const keys = Object.keys;
const assign = Object.assign;

const {
    CommonsChunkPlugin,
    UglifyJsPlugin,
    OccurrenceOrderPlugin,
    AggressiveMergingPlugin,
    ModuleConcatenationPlugin
} = webpack.optimize;
const {
    NODE_ENV,
    CONFIG,
    BUNDLE
} = process.env;
let confs = {};
if (CONFIG) {
    confs = JSON.parse(CONFIG);
}

let devtool = 'cheap-source-map';
let plugins = [
    new CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js'
    }),
];
let babelLoaderOption = {
    cacheDirectory: true,
    plugins: [
        'syntax-dynamic-import'
    ]
};
if (BUNDLE) {
    let bundle = assign(
        {analyzerHost: '0.0.0.0'},
        JSON.parse(BUNDLE)
    );
    plugins = plugins.concat([
        new BundleAnalyzerPlugin(bundle),
    ]);
    if ('production' !== NODE_ENV) {
        plugins = plugins.concat([
            new webpack.LoaderOptionsPlugin({
                minimize: true,
            }),
            new UglifyJsPlugin({
                compress: { 
                    unused: true,
                    dead_code: true,
                    join_vars: false,
                    hoist_funs: true,
                    collapse_vars: true,
                    passes:2,
                    side_effects: true,
                },
                mangle: false,
                beautify: true,
                output: {
                    comments: true 
                },
            }),
        ]);
    }
}
if ('production' === NODE_ENV) {
    devtool = false;
    babelLoaderOption.env = 'production';
    plugins = plugins.concat([
        new webpack.DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify('production'),
            '__DEVTOOLS__': false
          }
        }),
        new ModuleConcatenationPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new UglifyJsPlugin({
            compress: { warnings: false},
            comments: false
        }),
        new OccurrenceOrderPlugin(),
        new AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
        })
    ]);
}

/*vendor*/
const deduplicate = (arr) => {
    return Array.from(new Set(arr));
}
let vendor = ['react', 'react-dom', 'immutable'];
if (confs.webpackVendor) {
    vendor = vendor.concat(confs.webpackVendor);
}
vendor = deduplicate(vendor);

const myWebpack = (root, main)=>
{
    const path = root+ "/assets";
    if (!main) {
        main = { main: './build/src/client.js' };
    }

    let entry = {
        ...main,
        vendor
    };
    plugins = plugins.concat([
        new BundleTracker({path, filename: './stats.json'})
    ]);

    const alias = {
        react: root + '/node_modules/react'
    };
    if (confs.alias) {
        keys(confs.alias).forEach(function(k){
            alias[k] = confs.alias[k];
        });
    }

    return  {
        devtool,
        entry,
        output: {
            filename: "[name].bundle.js",
            path,
            publicPath: confs.assetsRoot,
            chunkFilename: "[id].[hash].bundle.js"
        },
        node: {
            fs: "empty",
            setImmediate: false
        },
        externals: confs.externals,
        resolve: {
            extensions: ['.js','.jsx'],
            alias
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
                    options: babelLoaderOption
                  }
            ]
        },
        plugins
    };
};

module.exports=myWebpack;
