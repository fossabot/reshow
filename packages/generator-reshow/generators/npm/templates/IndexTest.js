import { expect } from "chai";
import { render } from "reshow-unit";

import Index from "../Index";

describe("AjaxForm Test", () => {
  it("basic test", () => {
    const wrap = render(<Index />);
    expect(wrap.html()).to.have.string("Hello, there.");
  });
});
