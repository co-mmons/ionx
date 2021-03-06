import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const svgCss = ":host{display:inline-block}:host svg{display:inline-block;width:100%;height:100%;fill:var(--svg-fill-color);stroke:var(--svg-stroke-color);position:absolute;left:0px;top:0px}";

const Svg = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return h("span", { innerHTML: this.svg });
  }
  static get style() { return svgCss; }
};

const IonxSvg = /*@__PURE__*/proxyCustomElement(Svg, [1,"ionx-svg",{"svg":[1]}]);
const defineIonxSvg = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxSvg
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxSvg, defineIonxSvg };
