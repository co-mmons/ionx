import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const rowCss = "ionx-grid-row{display:flex;flex-wrap:wrap}";

let Row = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(Host, null, h("slot", null));
  }
  static get style() { return rowCss; }
};
Row = /*@__PURE__*/ proxyCustomElement(Row, [4, "ionx-grid-row"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-grid-row"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-grid-row":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Row);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxGridRow = Row;
const defineCustomElement = defineCustomElement$1;

export { IonxGridRow, defineCustomElement };
