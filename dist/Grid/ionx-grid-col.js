import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { WidthBreakpoint } from 'ionx/WidthBreakpoints';

const colCss = "ionx-grid-col{---size-xs:var(--ionx-width-breakpoints-xs) var(--size-xs, 12);---size-sm:var(--ionx-width-breakpoints-sm) var(--size-sm, 12);---size-md:var(--ionx-width-breakpoints-md) var(--size-md, 12);---size-lg:var(--ionx-width-breakpoints-lg) var(--size-lg, 12);---size-xl:var(--ionx-width-breakpoints-xl) var(--size-xl, 12);---size-xxl:var(--ionx-width-breakpoints-xxl) var(--size-xxl, 12);---grow-xs:var(--ionx-width-breakpoints-xs) var(--grow-xs, 1);---grow-sm:var(--ionx-width-breakpoints-sm) var(--grow-sm, 1);---grow-md:var(--ionx-width-breakpoints-md) var(--grow-md, 1);---grow-lg:var(--ionx-width-breakpoints-lg) var(--grow-lg, 1);---grow-xl:var(--ionx-width-breakpoints-xl) var(--grow-xl, 1);---grow-xxl:var(--ionx-width-breakpoints-xxl) var(--grow-xxl, 1);---shrink-xs:var(--ionx-width-breakpoints-xs) var(--shrink-xs, 1);---shrink-sm:var(--ionx-width-breakpoints-sm) var(--shrink-sm, 1);---shrink-md:var(--ionx-width-breakpoints-md) var(--shrink-md, 1);---shrink-lg:var(--ionx-width-breakpoints-lg) var(--shrink-lg, 1);---shrink-xl:var(--ionx-width-breakpoints-xl) var(--shrink-xl, 1);---shrink-xxl:var(--ionx-width-breakpoints-xxl) var(--shrink-xxl, 1);---basis-xs:var(--ionx-width-breakpoints-xs) var(--basis-xs, var(---width));---basis-sm:var(--ionx-width-breakpoints-sm) var(--basis-sm, var(---width));---basis-md:var(--ionx-width-breakpoints-md) var(--basis-md, var(---width));---basis-lg:var(--ionx-width-breakpoints-lg) var(--basis-lg, var(---width));---basis-xl:var(--ionx-width-breakpoints-xl) var(--basis-xl, var(---width));---basis-xxl:var(--ionx-width-breakpoints-xxl) var(--basis-xxl, var(---width));---width:calc((calc(var(---size, 12) / 12) * 100%) - var(--col-margin-start, 8px) - var(--col-margin-end, 8px));---size:var(---size-xxl, var(---size-xl, var(---size-lg, var(---size-md, var(---size-sm, var(---size-xs))))));---grow:var(---grow-xxl, var(---grow-xl, var(---grow-lg, var(---grow-md, var(---grow-sm, var(---grow-xs))))));---shrink:var(---shrink-xxl, var(---shrink-xl, var(---shrink-lg, var(---shrink-md, var(---shrink-sm, var(---shrink-xs))))));---basis:var(---basis-xxl, var(---basis-xl, var(---basis-lg, var(---basis-md, var(---basis-sm, var(---basis-xs))))));box-sizing:border-box;position:relative;min-height:1px;flex:var(---grow) var(---shrink) var(---basis);width:var(---width);max-width:var(---width);margin:var(--col-margin-top, 8px) var(--col-margin-end, 8px) var(--col-margin-bottom, 8px) var(--col-margin-start, 8px)}";

let Col = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    const xs = `${this.sizeXs ?? ""}` || null;
    const sm = `${this.sizeSm ?? ""}` || xs || null;
    const md = `${this.sizeMd ?? ""}` || sm || null;
    const lg = `${this.sizeLg ?? ""}` || md || null;
    const xl = `${this.sizeXl ?? ""}` || lg || null;
    const xxl = `${this.sizeXxl ?? ""}` || xl || null;
    const style = { xs, sm, md, lg, xl, xxl };
    for (const bp of WidthBreakpoint.values()) {
      if (style[bp.name] && style[bp.name] !== "auto") {
        style[`--size-${bp.name}`] = style[bp.name];
        style[`--grow-${bp.name}`] = "0";
        style[`--shrink-${bp.name}`] = "0";
      }
      else {
        style[`--basis-${bp.name}`] = "0";
      }
      delete style[bp.name];
    }
    return h(Host, { style: { ...style } }, h("slot", null));
  }
  static get style() { return colCss; }
};
Col = /*@__PURE__*/ proxyCustomElement(Col, [4, "ionx-grid-col", {
    "sizeXs": [8, "size-xs"],
    "sizeSm": [8, "size-sm"],
    "sizeMd": [8, "size-md"],
    "sizeLg": [8, "size-lg"],
    "sizeXl": [8, "size-xl"],
    "sizeXxl": [8, "size-xxl"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-grid-col"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-grid-col":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Col);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxGridCol = Col;
const defineCustomElement = defineCustomElement$1;

export { IonxGridCol, defineCustomElement };
