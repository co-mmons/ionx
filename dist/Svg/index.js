import { HTMLElement, forceUpdate, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { downloadFile } from 'ionx/utils';

const Svg = "ionx-svg";

const svgComponentCss = ":host{display:inline-block;width:100%}:host svg{display:inline-block;width:100%;fill:var(--svg-fill-color);stroke:var(--svg-stroke-color)}";

let SvgComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  sourceChanged(source) {
    if (source) {
      this.src = undefined;
      this.srcSource = undefined;
    }
  }
  async loadSrc(src) {
    if (src) {
      this.source = undefined;
      try {
        this.srcSource = await downloadFile(src, "text");
        this.element.dispatchEvent(new Event("load"));
      }
      catch (error) {
        this.element.dispatchEvent(new Event("error"));
      }
      forceUpdate(this);
    }
  }
  async componentWillLoad() {
    if (this.src) {
      await this.loadSrc(this.src);
    }
  }
  render() {
    const source = this.srcSource ?? this.source;
    let xml;
    if (typeof source === "string") {
      xml = source;
    }
    else if (source instanceof ArrayBuffer) {
      xml = new TextDecoder().decode(source);
    }
    return h(Host, null, h("span", { innerHTML: xml }));
  }
  get element() { return this; }
  static get watchers() { return {
    "source": ["sourceChanged"],
    "src": ["loadSrc"]
  }; }
  static get style() { return svgComponentCss; }
};

const IonxSvg = /*@__PURE__*/proxyCustomElement(SvgComponent, [1,"ionx-svg",{"src":[1025],"source":[1025]}]);
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
