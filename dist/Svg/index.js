import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const Svg = "ionx-svg";

const svgComponentCss = ":host{display:inline-block;width:100%}:host svg{display:inline-block;width:100%;fill:var(--svg-fill-color);stroke:var(--svg-stroke-color)}";

let SvgComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    let xml;
    if (typeof this.source === "string") {
      xml = this.source;
    }
    else if (this.source instanceof ArrayBuffer) {
      xml = new TextDecoder().decode(this.source);
    }
    return h(Host, null, h("span", { innerHTML: xml }));
  }
  static get style() { return svgComponentCss; }
};

const IonxSvg = /*@__PURE__*/proxyCustomElement(SvgComponent, [1,"ionx-svg",{"source":[1]}]);
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
defineIonxSvg();

export { IonxSvg, Svg, defineIonxSvg };
