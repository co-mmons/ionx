import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { WidthBreakpointsContainer } from 'ionx/WidthBreakpoints';

const Block$1 = "ionx-block";

const blockCss = ":host{display:block;margin:16px;--block--inner-width-xs:var(--ionx-width-breakpoints-xs) var(--block-inner-width-xs, 100%);--block--inner-width-sm:var(--ionx-width-breakpoints-sm) var(--block-inner-width-sm, 100%);--block--inner-width-md:var(--ionx-width-breakpoints-md) var(--block-inner-width-md, 100%);--block--inner-width-lg:var(--ionx-width-breakpoints-lg) var(--block-inner-width-lg, 100%);--block--inner-width-xl:var(--ionx-width-breakpoints-xl) var(--block-inner-width-xl, 100%);--block--inner-width-xxl:var(--ionx-width-breakpoints-xxl) var(--block-inner-width-xxl, 100%)}:host [ionx--outer]{display:flex}:host [ionx--outer][ionx--inner-alignment=center]{justify-content:center}:host [ionx--outer][ionx--inner-alignment=end]{justify-content:flex-end}:host [ionx--inner]{width:100%}:host(.ionx--no-margins){margin:0}:host(.ionx--has-inner-width) [ionx--inner]{width:var(--block--inner-width-xxl, var(--block--inner-width-xl, var(--block--inner-width-lg, var(--block--inner-width-md, var(--block--inner-width-sm, var(--block--inner-width-xs))))))}";

let Block = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.margins = true;
    this.padding = false;
  }
  connectedCallback() {
    this.breakpoints = new WidthBreakpointsContainer(this.element);
  }
  disconnectedCallback() {
    this.breakpoints.disconnect();
    this.breakpoints = undefined;
  }
  render() {
    const defaultWidth = typeof this.innerWidth === "string" ? this.innerWidth : null;
    const widths = defaultWidth ? {} : this.innerWidth;
    const xs = widths.xs || defaultWidth || null;
    const sm = widths.sm || xs || null;
    const md = widths.md || sm || null;
    const lg = widths.lg || md || null;
    const xl = widths.xl || lg || null;
    const xxl = widths.xxl || xl || null;
    return h(Host, { class: { "ionx--no-margins": this.margins === false, "ionx--has-inner-width": !!this.innerWidth }, style: {
        "--block-inner-width-xs": xs,
        "--block-inner-width-sm": sm,
        "--block-inner-width-md": md,
        "--block-inner-width-lg": lg,
        "--block-inner-width-xl": xl,
        "--block-inner-width-xxl": xxl,
      } }, h("div", { "ionx--outer": true, "ionx--inner-alignment": this.innerAlignment || null, part: "outer" }, h("div", { "ionx--inner": true, style: this.innerStyle, part: "inner" }, h("slot", null))));
  }
  get element() { return this; }
  static get style() { return blockCss; }
};

const IonxBlock = /*@__PURE__*/proxyCustomElement(Block, [1,"ionx-block",{"innerWidth":[1,"inner-width"],"innerAlignment":[1,"inner-alignment"],"innerStyle":[16],"margins":[4],"padding":[4]}]);
const defineIonxBlock = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxBlock
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};
defineIonxBlock();

export { Block$1 as Block, IonxBlock, defineIonxBlock };
