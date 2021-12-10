import { HTMLElement, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const dragulaStylesCss = ".gu-mirror{position:fixed !important;margin:0 !important;z-index:9999 !important;opacity:0.8;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";filter:alpha(opacity=80)}.gu-hide{display:none !important}.gu-unselectable{-webkit-user-select:none !important;-moz-user-select:none !important;-ms-user-select:none !important;user-select:none !important}.gu-transit{opacity:0.2;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)\";filter:alpha(opacity=20)}";

let DragulaStyles = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  static get style() { return dragulaStylesCss; }
};

const IonxDragulaStyles = /*@__PURE__*/proxyCustomElement(DragulaStyles, [0,"ionx-dragula-styles"]);
const defineIonxDragula = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxDragulaStyles
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxDragulaStyles, defineIonxDragula };
