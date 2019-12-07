import webpack from 'webpack';
import moduleAlias from 'module-alias';
import {getProdUglify} from './uglify';
import reshowRuntimeAlias from './reshowRuntimeAlias';

const {
  OccurrenceOrderPlugin,
  ModuleConcatenationPlugin,
  LimitChunkCountPlugin,
} = webpack.optimize;
const {NODE_ENV, CONFIG} = process.env;
let confs = {};
if (CONFIG) {
  confs = JSON.parse(CONFIG);
}

let plugins = [new LimitChunkCountPlugin({maxChunks: 1})];
let babelLoaderOption = {
  cacheDirectory: true,
  plugins: ['@babel/plugin-syntax-dynamic-import'],
};

const myWebpack = (root, entry, lazyConfs) => {
  confs = {...confs, ...lazyConfs};
  if ('production' === NODE_ENV) {
    babelLoaderOption.envName = 'production';
    plugins = plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          __DEVTOOLS__: false,
        },
      }),
      new ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      getProdUglify(),
      new OccurrenceOrderPlugin(),
    ]);
  }
  if (!entry) {
    entry = {
      node: './build/src/server.js',
    };
  }
  const alias = {
    ...reshowRuntimeAlias(root),
    ...confs.alias,
  };
  moduleAlias.addAliases(alias);
  return {
    entry,
    output: {
      filename: '[name].bundle.js',
      path: root + '/assets',
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      setImmediate: false,
    },
    externals: confs.externals,
    resolve: {
      extensions: ['.mjs', '.js', '.jsx'],
    },
    resolveLoader: {
      modules: [root + '/node_modules'],
    },
    module: {
      loaders: [
        {
          test: /(.js|.jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: babelLoaderOption,
        },
      ],
    },
    plugins: plugins,
  };
};

module.exports = myWebpack;
