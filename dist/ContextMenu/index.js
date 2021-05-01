import { h, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { popoverController } from '@ionic/core';

async function showContextMenu(target, items, options) {
  const popover = await popoverController.create(Object.assign(Object.assign({}, (options !== null && options !== void 0 ? options : {})), { component: "ionx-context-menu", componentProps: { items }, event: target instanceof HTMLElement ? { target } : target }));
  await popover.present();
  popover.animated = false;
}

const contextMenuCss = ".sc-ionx-context-menu-h ion-list.sc-ionx-context-menu{margin:0;padding:0}.sc-ionx-context-menu-h ion-list.sc-ionx-context-menu>ion-item.item.sc-ionx-context-menu:last-child,.sc-ionx-context-menu-h ion-list.sc-ionx-context-menu>*.sc-ionx-context-menu:last-child>ion-item.item.sc-ionx-context-menu:last-child{--border-width:0;--inner-border-width:0}";

const ContextMenu = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  async itemClicked(item) {
    await popoverController.dismiss();
    try {
      item.handler();
    }
    catch (e) {
      console.warn(e);
    }
  }
  render() {
    return h("ion-list", null, this.items.map(item => h("ion-item", { button: true, detail: false, onClick: () => this.itemClicked(item) }, (item.iconSrc || item.iconName) && h("ion-icon", { name: item.iconName, src: item.iconSrc, slot: "start" }), h("ion-label", null, item.label))));
  }
  get element() { return this; }
  static get style() { return contextMenuCss; }
};

const IonxContextMenu = /*@__PURE__*/proxyCustomElement(ContextMenu, [2,"ionx-context-menu",{"items":[16]}]);
const defineIonxContextMenu = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxContextMenu
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxContextMenu, defineIonxContextMenu, showContextMenu };
