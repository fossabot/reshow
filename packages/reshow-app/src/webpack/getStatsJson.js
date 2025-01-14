import { StatsWriterPlugin } from "webpack-stats-plugin";
import get from "get-object-value";
const keys = Object.keys;
const isArray = Array.isArray;

const getStatsJson = ({ assetsStore }) => {
  // https://github.com/FormidableLabs/webpack-stats-plugin
  return new StatsWriterPlugin({
    filename: "stats.json",
    transform(data, opts) {
      const files = get(data, ["assetsByChunkName"]);
      const { hash, outputOptions } = get(opts, ["compiler"], {});
      const publicPath = outputOptions?.publicPath;
      const chunks = {};
      keys(files).forEach((key) => {
        const name = isArray(files[key]) ? files[key][0] : files[key];
        chunks[key] = [
          {
            name,
            publicPath: publicPath + name + "?" + hash.substring(0, 7),
          },
        ];
      });
      assetsStore.current = { chunks, publicPath, status: "done" };
      return JSON.stringify(assetsStore.current, null, 2);
    },
  });
};

export default getStatsJson;
