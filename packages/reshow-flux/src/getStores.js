import callfunc from "call-func";
import { IS_ARRAY } from "reshow-constant";
import dedup from "array.dedup";
import { removeEmpty } from "array.merge";

const storeLocator = (props) => props?.stores;

const getStores = ({ props, options }) => {
  const allProps = { ...options, ...props };
  let stores = callfunc(allProps?.storeLocator || storeLocator, [allProps]);
  if (!IS_ARRAY(stores)) {
    stores = [stores];
  }
  stores = dedup(removeEmpty(stores));
  const firstStore = stores[0];
  return { stores, allProps, firstStore };
};

export default getStores;
