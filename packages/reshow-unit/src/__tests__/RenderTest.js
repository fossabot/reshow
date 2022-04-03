import { expect } from "chai";
import { render, unmount, getRoleHtml } from "../index";

describe("Test Render", () => {
  it("basic test", () => {
    const Foo = (props) => <div>bar</div>;
    const wrap = render(<Foo />);
    expect(wrap.html()).to.equal("<div>bar</div>");
  });

  it("test unmount", () => {
    const Foo = (props) => <div>bar</div>;
    const wrap = render(<Foo />);
    expect(document.body.innerHTML).to.have.string("bar");
    wrap.unmount();
    expect(document.body.innerHTML).not.have.string("bar");
  });

  it("Test get role html", () => {
    const Foo = (props) => <div role="dom">bar</div>;
    render(<Foo />);
    expect(getRoleHtml("dom")).to.equal(`<div role="dom">bar</div>`);
  });
});
