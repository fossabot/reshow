import { useConnect as useConn } from "reshow-flux";
import MemoReturn from "../organisms/MemoReturn";
import connectOptions from "../../src/connectOptions";

const getReturn = ({
  displayName = "Return",
  useConnect,
  cleanProps,
  options,
} = {}) => {
  useConnect = useConnect || useConn({ ...connectOptions, ...options });
  const Return = (props) => {
    const { children, backfillProps, ...otherProps } = props;
    const state = useConnect(props);
    const nextProps = backfillProps
      ? {
          ...state,
          ...connectOptions.reset(otherProps, cleanProps),
        }
      : {
          ...connectOptions.reset(otherProps, cleanProps),
          ...state,
        };
    return <MemoReturn props={nextProps}>{children}</MemoReturn>;
  };

  Return.displayName = displayName;
  return Return;
};

const Return = getReturn();

export default Return;
export { getReturn };
