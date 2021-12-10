import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const inputGroupCss = ".sc-ionx-input-group-h{display:flex}ionx-form-field.sc-ionx-input-group-s>ion-input,ionx-form-field .sc-ionx-input-group-s>ion-input{--padding-start:0;--padding-end:0}ionx-form-field.sc-ionx-input-group-s>ion-input:first-child,ionx-form-field .sc-ionx-input-group-s>ion-input:first-child{--padding-start:16px}ionx-form-field.sc-ionx-input-group-s>ion-input:last-child,ionx-form-field .sc-ionx-input-group-s>ion-input:last-child{--padding-end:16px}";

let InputGroup = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(Host, null, h("slot", null));
  }
  static get style() { return inputGroupCss; }
};

const IonxInputGroup = /*@__PURE__*/proxyCustomElement(InputGroup, [6,"ionx-input-group"]);
const defineIonxInputGroup = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxInputGroup
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxInputGroup, defineIonxInputGroup };
