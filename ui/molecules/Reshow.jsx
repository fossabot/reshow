import React, { PureComponent } from "react";
import get from "get-object-value";
import { AjaxPage } from "organism-react-ajax";
import { doc } from "win-doc";
import callfunc from "call-func";
import { toJS } from "reshow-return";

import { Return } from "../molecules/ReshowComponent";
import updateCanonicalUrl, {
  initCanonicalUrl
} from "../../src/updateCanonicalUrl";
import { dispatch } from "../../src/dispatcher";
import { globalStore } from "../../src/stores/globalStore";
import pageStore from "../../src/stores/pageStore";

const isArray = Array.isArray;
let isInit;

const update = params => {
  const realTimeData = get(params, ["--realTimeData--"]);
  const reset = get(params, ["--reset--"]);
  const type = realTimeData
    ? "realTime"
    : "config/" + (reset ? "re" : "") + "set";
  dispatch(type, toJS(params));
  const oDoc = doc();
  if (oDoc.URL) {
    const htmlTitle = get(params, ["htmlTitle"]);
    if (htmlTitle) {
      if (isArray(htmlTitle)) {
        oDoc.title = get(htmlTitle, [0]);
      } else {
        oDoc.title = htmlTitle;
      }
    }
    const canonical = get(params, ["data", "canonical"]);
    if (canonical) {
      updateCanonicalUrl(canonical, params);
    }
  }
};

class Reshow extends PureComponent {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  getPath() {
    return this.resetGlobalPath();
  }

  resetGlobalPath(path) {
    path = path ?? pageStore.getThemePath();
    globalStore.path = path;
    return globalStore.path;
  }

  getGlobalPath() {
    return globalStore.path;
  }

  constructor(props) {
    super(props);
    if (isInit) {
      console.warn("The best practice is avoid multi Reshow Component.");
      this.state = { hasError: true };
    } else {
      update(props);
      this.state = { hasError: false };
      isInit = 1;
    }
    this.getPath = this.getPath.bind(this);
  }

  componentDidMount() {
    // Server site version also need update Canonical
    initCanonicalUrl(this.props);
  }

  componentDidCatch(error, info) {
    const { onError } = this.props;
    if (onError) {
      callfunc(onError, [error, info]);
    } else {
      console.error([error, info]);
    }
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return null;
    }
    const { onError, themes, ajax, webSocketUrl } = this.props;

    return (
      <Return initStates={["baseUrl", "staticVersion", "themePath"]}>
        {() => (
          <AjaxPage
            callback={update}
            /*State*/
            themePath={this.getPath()}
            /*Props*/
            themes={themes}
            ajax={ajax}
            webSocketUrl={webSocketUrl}
          />
        )}
      </Return>
    );
  }
}

export default Reshow;
export { update };
