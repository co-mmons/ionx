import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { WidthBreakpointsContainer } from 'ionx/WidthBreakpoints';

const gridCss = "ionx-grid{display:block;margin:var(--grid-margin-top, 8px) var(--grid-margin-end, 8px) var(--grid-margin-bottom, 8px) var(--grid-margin-start, 8px)}";

let Grid = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  connectedCallback() {
    this.breakpoints = new WidthBreakpointsContainer(this.element);
  }
  disconnectedCallback() {
    this.breakpoints.disconnect();
    this.breakpoints = undefined;
  }
  render() {
    return h(Host, null, h("slot", null));
  }
  get element() { return this; }
  static get style() { return gridCss; }
};
Grid = /*@__PURE__*/ proxyCustomElement(Grid, [4, "ionx-grid"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-grid"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-grid":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Grid);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxGrid = Grid;
const defineCustomElement = defineCustomElement$1;

export { IonxGrid, defineCustomElement };
