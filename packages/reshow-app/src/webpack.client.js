import webpack from "webpack";
import getResolve, { getResolveLoader } from "./webpack/getResolve";
import getEntry from "./webpack/getEntry";
import getOptimization from "./webpack/getOptimization";
import getModule from "./webpack/getModule";
import getPlugins from "./webpack/getPlugins";
import getOutput from "./webpack/getOutput";
import getHotServer from "./webpack/getHotServer";
import { DEVELOPMENT, PRODUCTION } from "./webpack/const";
import progress from "./webpack/progress";

const { NODE_ENV, CONFIG, BUNDLE, HOT_UPDATE, ENABLE_SW } = process.env;
const processConfs = CONFIG ? JSON.parse(CONFIG) : {};

const myWebpack = (root, main, lazyConfs) => {
  const confs = { assetsFolder: "/assets", ...processConfs, ...lazyConfs };
  const stop = progress({ confs });
  const path = root + confs.assetsFolder;
  let mode = DEVELOPMENT;
  let devtool = "cheap-source-map";
  if (PRODUCTION === NODE_ENV) {
    mode = PRODUCTION;
    devtool = false;
  } else {
    confs.bustMode = null;
  }
  const result = {
    mode,
    devtool,
    entry: getEntry({ main, confs }),
    output: getOutput({ path, confs }),
    optimization: getOptimization({ mode, confs }),
    plugins: getPlugins({
      path,
      stop,
      mode,
      confs,
      BUNDLE,
      HOT_UPDATE,
      ENABLE_SW,
    }),
    module: getModule({ mode, HOT_UPDATE }),
    resolve: getResolve({ confs, root }),
    resolveLoader: getResolveLoader({ root }),
    externals: confs.externals,
  };
  if (HOT_UPDATE) {
    result.devServer = getHotServer({ confs, path });
  }
  return result;
};

module.exports = myWebpack;
