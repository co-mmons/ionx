import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { W as WidthBreakpointsContainer } from './WidthBreakpointsContainer.js';

const containerComponentCss = "ionx-width-breakpoints{display:block}";

let ContainerComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  connectedCallback() {
    this.container = new WidthBreakpointsContainer(this.element, this.accessorName);
  }
  disconnectedCallback() {
    this.container.disconnect();
    this.container = undefined;
  }
  render() {
    if (this.prefetch) {
      return;
    }
    return h(Host, null);
  }
  get element() { return this; }
  static get style() { return containerComponentCss; }
};
ContainerComponent = /*@__PURE__*/ proxyCustomElement(ContainerComponent, [0, "ionx-width-breakpoints", {
    "accessorName": [1, "accessor-name"],
    "prefetch": [4]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-width-breakpoints"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-width-breakpoints":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, ContainerComponent);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxWidthBreakpoints = ContainerComponent;
const defineCustomElement = defineCustomElement$1;

export { IonxWidthBreakpoints, defineCustomElement };
