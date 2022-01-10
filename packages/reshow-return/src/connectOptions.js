import get from "get-object-value";
import callfunc from "call-func";
import toJS from "./toJS";

const keys = Object.keys;
const isArray = Array.isArray;
const getImmutable = (immutable) => (data) => !immutable ? toJS(data) : data;
const getMapIn = (map, path) =>
  map && map.getIn ? map.getIn(path) : undefined;

const reset = (props, more) => {
  const nextProps = { ...props };
  const cleanKeys = [
    "immutable",
    "initStates",
    "pathStates",
    "store",
    "storeLocator",
    ...(more || []),
  ];
  let i = cleanKeys.length;
  while (i--) {
    delete nextProps[cleanKeys[i]];
  }
  return nextProps;
};

const calculateState = (prevState, options) => {
  /**
   * Why not support multi stores?
   * Because multi stores need handle complex data merge.
   * If that case need create custom calculateState functoin.
   */
  const { initStates, pathStates, immutable: propsImmutable, store } = options;
  const storeState = store.getState();
  const immutable = propsImmutable || storeState.get("immutable");
  const results = {};
  if (immutable) {
    results.immutable = immutable;
  }

  const toImmutable = getImmutable(immutable);

  if (isArray(initStates)) {
    initStates.forEach((key) => {
      const data = storeState.get(key);
      results[key] = toImmutable(data);
    });
  } else if (initStates) {
    keys(initStates).forEach((key) => {
      const data = storeState.get(key);
      const newKey = null != initStates[key] ? initStates[key] : key;
      results[newKey] = toImmutable(data);
    });
  }

  keys(pathStates || {}).forEach((key) => {
    const thisPath = pathStates[key];
    results[key] = immutable
      ? getMapIn(results[thisPath[0]], thisPath.slice(1))
      : get(results, thisPath);
  });
  return results;
};

const connectOptions = {
  calculateState,
  reset,
};

export default connectOptions;
