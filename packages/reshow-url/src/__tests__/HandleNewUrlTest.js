import React, { PureComponent } from "react";
import { expect } from "chai";
import { mount, cleanIt, jsdom } from "reshow-unit";

jsdom(null, { url: "http://localhost" });
import { AjaxPage, ajaxDispatch } from "organism-react-ajax";
import urlStore from "../stores/urlStore";

describe("Test Handle New Url", () => {
  after(() => {
    ajaxDispatch({ onUrlChange: null });
    cleanIt();
  });

  it("test history back", (done) => {
    const myUpdate = () => {
      expect(true).to.be.true;
      done();
    };
    ajaxDispatch({ onUrlChange: myUpdate });
    const wrap = mount(
      <AjaxPage win={window} themes={{ fake: <div /> }} themePath="fake" />
    );
    window.history.pushState(null, "title", "http://localhost/bbb");
    window.history.pushState(null, "title", "http://localhost/ccc");
    setTimeout(() => window.history.back());
  });
});
