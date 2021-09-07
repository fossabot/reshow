import "setimmediate";
import { useState, useEffect, useDebugValue } from "react";
import dedup from "array.dedup";
import { CHANGE } from "reshow-flux-base";
import { useMounted } from "reshow-hooks";
import { T_TRUE, T_FALSE } from "reshow-constant";

import getStores from "./getStores";

const handleShouldComponentUpdate = ({
  shouldComponentUpdate,
  calculateState,
  prev,
  props,
}) => {
  const state =
    !shouldComponentUpdate || shouldComponentUpdate({ prev, props })
      ? calculateState(prev.state, props)
      : prev.state;
  return {
    __init__: T_TRUE,
    props,
    state,
  };
};

const useConnect = (options) => (props) => {
  const {
    calculateState,
    shouldComponentUpdate,
    displayName = "useConnect",
  } = options || {};
  useDebugValue(displayName);
  const [data, setData] = useState(() => ({
    props,
    state: calculateState({}, props),
  }));

  const isMount = useMounted();

  useEffect(() => {
    if (props.withPropsChange) {
      setLastProps(props);
    }
  }, [props]);

  const [lastProps, setLastProps] = useState(props);
  useEffect(() => {
    const stores = dedup(getStores(lastProps)) || [];
    if (stores && stores.length) {
      const handleChange = () => {
        if (T_FALSE !== isMount()) {
          setData((prev) =>
            handleShouldComponentUpdate({
              shouldComponentUpdate,
              calculateState,
              prev,
              props: lastProps,
            })
          );
        }
      };
      if (!data.__init__ || data.props !== lastProps) {
        handleChange();
      }
      const asyncHandleChange = () => setImmediate(handleChange);
      stores.forEach((store) => store?.addListener(asyncHandleChange, CHANGE));
      return () => {
        stores.forEach((store) =>
          store?.removeListener(asyncHandleChange, CHANGE)
        );
      };
    }
  }, [lastProps]);

  return data.state || {};
};

export default useConnect;
