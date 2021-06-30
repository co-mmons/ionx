import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const blockCss = ".sc-ionx-block-h{display:block}.ionx--margins.sc-ionx-block-h{margin:16px}.sc-ionx-block-h [ionx--outer].sc-ionx-block{display:flex}.sc-ionx-block-h [ionx--outer][ionx--inner-alignment=center].sc-ionx-block{justify-content:center}.sc-ionx-block-h [ionx--outer][ionx--inner-alignment=end].sc-ionx-block{justify-content:flex-end}.sc-ionx-block-h [ionx--inner].sc-ionx-block{width:100%}.ionx--has-inner-width.sc-ionx-block-h>[ionx--outer].sc-ionx-block>[ionx--inner].sc-ionx-block{width:var(--block-inner-width-xs, 100%)}@media (min-width: 576px){.ionx--has-inner-width.sc-ionx-block-h>[ionx--outer].sc-ionx-block>[ionx--inner].sc-ionx-block{width:var(--block-inner-width-sm, var(--block-inner-width-xs, 100%))}}@media (min-width: 768px){.ionx--has-inner-width.sc-ionx-block-h>[ionx--outer].sc-ionx-block>[ionx--inner].sc-ionx-block{width:var(--block-inner-width-md, var(--block-inner-width-sm, var(--block-inner-width-xs, 100%)))}}@media (min-width: 992px){.ionx--has-inner-width.sc-ionx-block-h>[ionx--outer].sc-ionx-block>[ionx--inner].sc-ionx-block{width:var(--block-inner-width-lg, var(--block-inner-width-md, var(--block-inner-width-sm, var(--block-inner-width-xs, 100%))))}}@media (min-width: 1200px){.ionx--has-inner-width.sc-ionx-block-h>[ionx--outer].sc-ionx-block>[ionx--inner].sc-ionx-block{width:var(--block-inner-width-xl, var(--block-inner-width-lg, var(--block-inner-width-md, var(--block-inner-width-sm, var(--block-inner-width-xs, 100%)))))}}";

const Block = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.margins = true;
    this.padding = false;
  }
  render() {
    const defaultWidth = typeof this.innerWidth === "string" ? this.innerWidth : null;
    const widths = defaultWidth ? {} : this.innerWidth;
    return h(Host, { class: { "ionx--margins": !!this.margins, "ionx--has-inner-width": !!this.innerWidth }, style: {
        "--block-inner-width-xs": (widths === null || widths === void 0 ? void 0 : widths.xs) ? `${widths === null || widths === void 0 ? void 0 : widths.xs}` : defaultWidth,
        "--block-inner-width-sm": (widths === null || widths === void 0 ? void 0 : widths.sm) ? `${widths === null || widths === void 0 ? void 0 : widths.sm}` : defaultWidth,
        "--block-inner-width-md": (widths === null || widths === void 0 ? void 0 : widths.md) ? `${widths === null || widths === void 0 ? void 0 : widths.md}` : defaultWidth,
        "--block-inner-width-lg": (widths === null || widths === void 0 ? void 0 : widths.lg) ? `${widths === null || widths === void 0 ? void 0 : widths.lg}` : defaultWidth,
        "--block-inner-width-xl": (widths === null || widths === void 0 ? void 0 : widths.xl) ? `${widths === null || widths === void 0 ? void 0 : widths.xl}` : defaultWidth
      } }, h("div", { "ionx--outer": true, "ionx--inner-alignment": this.innerAlignment || null }, h("div", { "ionx--inner": true, style: this.innerStyle }, h("slot", null))));
  }
  static get style() { return blockCss; }
};

const IonxBlock = /*@__PURE__*/proxyCustomElement(Block, [6,"ionx-block",{"innerWidth":[1,"inner-width"],"innerAlignment":[1,"inner-alignment"],"innerStyle":[16],"margins":[4],"padding":[4]}]);
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

export { IonxBlock, defineIonxBlock };
