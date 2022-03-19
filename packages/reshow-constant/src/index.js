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
export const OBJ_SIZE = (o) => (o ? KEYS(o).length : 0);
export const IS_ARRAY = Array.isArray;

// reshow specific
export const REAL_TIME_URL = "--real-time-url--";
export const REAL_TIME_DATA_KEY = "--real-time-data-key--";
