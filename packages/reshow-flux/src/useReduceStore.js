import { useRef } from "react";
import { createReducer } from "reshow-flux-base";
import { Map, defaultReducer } from "./ImmutableStore";

const useReduceStore = (reduce, initState) => {
  const lastReducer = useRef();
  if (!lastReducer.current) {
    reduce = reduce || defaultReducer;
    initState = initState || Map();
    lastReducer.current = createReducer(reduce, initState);
  }
  return lastReducer.current;
};

export default useReduceStore;
