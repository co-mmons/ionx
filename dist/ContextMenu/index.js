import { HTMLElement as HTMLElement$1, h, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { popoverController } from '@ionic/core';
import { addEventListener } from 'ionx/utils';

async function showContextMenu(target, items, options) {
  const popover = await popoverController.create({
    ...(options ?? {}),
    component: "ionx-context-menu",
    componentProps: { items: items.filter(item => !!item) },
    event: target instanceof HTMLElement ? { target } : target
  });
  await popover.present();
  popover.animated = false;
}

const internalProp = "__ionxContextMenuToggle";
function contextMenuToggleButton(items, options) {
  // returns anonymous function, which will:
  // 1. create __ionxContextMenuToggle prop in a button element, this will be onClick unlisten function
  // 2. create __ionxContextMenuToggle prop on a function itself, with onClick unlisten function
  const func = function (el) {
    if (!el) {
      this[internalProp]?.();
    }
    else {
      // already initialized by other ref call
      if (typeof el[internalProp] === "function") {
        el[internalProp]();
        delete el[internalProp];
      }
      const checkedItems = items.filter(item => !!item);
      if (checkedItems.length > 0) {
        el.removeAttribute("hidden");
        this[internalProp] = el[internalProp] = addEventListener(el, "click", ev => showContextMenu(ev, items, options));
      }
      else {
        el.setAttribute("hidden", "");
      }
    }
  };
  return func.bind(func);
}

const contextMenuCss = ".sc-ionx-context-menu-h{overflow:initial !important}.sc-ionx-context-menu-h ion-list.sc-ionx-context-menu{margin:0;padding:0}.sc-ionx-context-menu-h ion-list.sc-ionx-context-menu ion-item.sc-ionx-context-menu{--border-width:0 0 var(--ionx-border-width) 0;--inner-border-width:0;--inner-padding-start:0;--inner-padding-end:0;--padding-start:16px;--padding-end:16px}.sc-ionx-context-menu-h ion-list.sc-ionx-context-menu>ion-item.item.sc-ionx-context-menu:last-child,.sc-ionx-context-menu-h ion-list.sc-ionx-context-menu>*.sc-ionx-context-menu:last-child>ion-item.item.sc-ionx-context-menu:last-child{--border-width:0}.sc-ionx-context-menu-h ion-list.sc-ionx-context-menu ion-item.sc-ionx-context-menu>[slot=start].sc-ionx-context-menu{margin-right:16px;margin-left:0px}";

let ContextMenu = class extends HTMLElement$1 {
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
    return h("ion-list", null, this.items.map(item => h("ion-item", { button: true, disabled: item.disabled, detail: false, onClick: () => this.itemClicked(item) }, (item.iconSrc || item.iconName) && h("ion-icon", { name: item.iconName, src: item.iconSrc, slot: "start" }), h("ion-label", null, item.label))));
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

export { IonxContextMenu, contextMenuToggleButton, defineIonxContextMenu, showContextMenu };
