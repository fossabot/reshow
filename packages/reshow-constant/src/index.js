export const DEFAULT = "default";
export const FUNCTION = "function";
export const NUMBER = "number";
export const OBJECT = "object";
export const STRING = "string";
export const SYMBOL = "symbol";
export const SCRIPT = "script";
export const UNDEFINED = "undefined";
export const TYPE_ERROR = "TypeError";
export const T_UNDEFINED = undefined;
export const T_NULL = null;
export const T_TRUE = true;
export const T_FALSE = false;
export const KEYS = Object.keys;
export const IS_ARRAY = Array.isArray;
export const OBJ_SIZE = (o) => (o ? KEYS(o).length : 0);
export const NEW_OBJ = () => Object.create(null);
export const HAS = (obj, key) =>
  !!(obj && Object.prototype.hasOwnProperty.call(obj, key));

// reshow specific
export const REAL_TIME_URL = "--rtime-url--";
export const REAL_TIME_DATA_KEY = "--rtime-data--";
