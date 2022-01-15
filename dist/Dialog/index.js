import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { modalController } from '@ionic/core';
import { prefetchComponent } from 'ionx/utils';
import { Subject, firstValueFrom } from 'rxjs';
import { HtmlString } from '@co.mmons/js-utils/core';

async function showDialog(options) {
  const modal = await modalController.create(Object.assign({}, options, {
    component: "ionx-dialog",
    componentProps: options
  }));
  modal.style.setProperty("--width", options.width || "300px");
  modal.style.setProperty("--height", "auto");
  modal.style.setProperty("--max-width", "90vw");
  modal.style.setProperty("--max-height", "90vh");
  modal.style.setProperty("--border-radius", "var(--ionx-border-radius)");
  modal.style.setProperty("--backdrop-opacity", "var(--ion-backdrop-opacity, 0.32)");
  if (!document.querySelector("html.ios")) {
    modal.style.setProperty("--box-shadow", "0px 28px 48px rgba(0, 0, 0, 0.4)");
  }
  await modal.present();
  return modal.querySelector("ionx-dialog");
}
(function (showDialog) {
  showDialog.prefetchComponents = ["ionx-dialog", "ion-modal"];
})(showDialog || (showDialog = {}));

const dialogValueAttribute = "ionx-dialog-value";
const markAsDialogValue = { [dialogValueAttribute]: true };

var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Dialog_didEnter;
let Dialog = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    _Dialog_didEnter.set(this, new Subject());
  }
  async clickButton(role) {
    const buttonsElem = this.element.querySelector("ionx-dialog-buttons");
    if (buttonsElem) {
      const button = buttonsElem.buttons?.find(button => button.role === role);
      if (button) {
        await buttonsElem.buttonClicked(button);
      }
    }
  }
  /**
   * A promise resolved when dialog was fully presented.
   */
  onDidEnter() {
    return firstValueFrom(__classPrivateFieldGet(this, _Dialog_didEnter, "f"));
  }
  ionDidEnter() {
    __classPrivateFieldGet(this, _Dialog_didEnter, "f").next(true);
  }
  onDidDismiss() {
    return this.element.closest("ion-modal").onDidDismiss();
  }
  onWillDismiss() {
    return this.element.closest("ion-modal").onWillDismiss();
  }
  componentDidLoad() {
    if (this.prefetch) {
      prefetchComponent({ delay: 0 }, "ionx-dialog-content", "ionx-dialog-headers", "ionx-dialog-message", "ionx-dialog-buttons");
    }
  }
  render() {
    if (this.prefetch) {
      return;
    }
    const Component = this.component;
    const Message = this.messageComponent;
    return h(Host, { style: { display: "flex", position: "initial", contain: "initial" } }, this.component && h(Component, { ...this.componentProps }), !this.component && h("ionx-dialog-content", null, (this.header || this.subheader) && h("ionx-dialog-headers", { slot: "header", header: this.header, subheader: this.subheader }), this.messageComponent && h(Message, { ...this.messageComponentProps, slot: "message" }), !this.messageComponent && this.message && h("ionx-dialog-message", { message: this.message, slot: "message" }), this.buttons && this.buttons.length && h("ionx-dialog-buttons", { buttons: this.buttons, slot: "footer" })));
  }
  get element() { return this; }
};
_Dialog_didEnter = new WeakMap();

const dialogButtonsCss = ".sc-ionx-dialog-buttons-h{--dialog--border-color:var(--dialog-border-color, var(--ion-border-color));display:block}.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons{--border-color:var(--dialog--border-color)}.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-toolbar.sc-ionx-dialog-buttons{--padding-start:0px;--padding-end:0px;--padding-top:0px;--padding-bottom:0px;--min-height:none;--ion-safe-area-bottom:0px;--ion-safe-area-top:0px;--ion-safe-area-start:0px;--ion-safe-area-end:0px;--ion-toolbar-background:var(--dialog--background-color, #ffffff);--ion-toolbar-background-color:var(--dialog--background-color, #000000);--ion-toolbar-color:var(--dialog--foreground-color, #000000)}.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-buttons.sc-ionx-dialog-buttons{justify-content:var(--dialog-buttons-align, flex-end)}.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons{min-height:44px;margin:0px}.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons:not(:last-child){font-weight:400}.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons:last-child{font-weight:500}.md.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-toolbar.sc-ionx-dialog-buttons,.md .sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-toolbar.sc-ionx-dialog-buttons{--padding-bottom:8px;--padding-end:8px}.md.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons::before,.md .sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons::before{display:none}.md.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons,.md .sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons{flex:none !important}.ios.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons,.ios .sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons{flex:1}.ios.sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons:not(:first-child),.ios .sc-ionx-dialog-buttons-h ion-footer.sc-ionx-dialog-buttons ion-button.sc-ionx-dialog-buttons:not(:first-child){border-left:var(--ionx-border-width) solid var(--dialog--border-color)}";

let DialogButtons = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  async buttonClicked(button) {
    let value;
    if (!button.role || button.role !== "cancel") {
      try {
        value = await (this.element.closest("ionx-dialog").querySelector(`[${dialogValueAttribute}]`)?.dialogValue?.());
      }
      catch (error) {
        console.debug("Dialog value aborted", error);
        return;
      }
    }
    if (button.valueHandler) {
      try {
        value = button.valueHandler();
        if (value instanceof Promise) {
          value = await value;
        }
        modalController.dismiss(value, button.role);
      }
      catch (error) {
        console.debug("Dialog button aborted", error);
      }
      return;
    }
    if (button.handler) {
      let res = button.handler(value);
      if (res instanceof Promise) {
        res = await res;
      }
      if ((typeof res === "boolean" && res) || typeof res !== "boolean") {
        modalController.dismiss(value, button.role);
      }
      return;
    }
    else {
      modalController.dismiss(button.role !== "cancel" ? value : undefined, button.role);
    }
  }
  componentDidLoad() {
    if (this.prefetch) {
      prefetchComponent({ delay: 0 }, "ion-footer", "ion-toolbar", "ion-buttons", "ion-button", "ion-icon");
    }
  }
  render() {
    if (this.prefetch) {
      return;
    }
    return h(Host, null, h("ion-footer", null, h("ion-toolbar", null, h("ion-buttons", null, h("slot", null), this.buttons.map(button => h("ion-button", { fill: "clear", style: { flex: `${button.flex}` || "1" }, color: button.color || "primary", size: button.size || "default", onClick: () => this.buttonClicked(button) }, button.label && h("span", null, button.label), button.icon && h("ion-icon", { icon: button.icon, slot: button.label ? "start" : "icon-only" })))))));
  }
  get element() { return this; }
  static get style() { return dialogButtonsCss; }
};

const dialogContentCss = ":host{display:flex;flex-direction:column;background:var(--dialog--background-color, #ffffff);color:var(--dialog--foreground-color);max-height:90vh}::slotted([slot=message]){margin:16px 16px 24px 16px}";

let DialogContent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return h(Host, null, h("slot", { name: "header" }), h("slot", { name: "message" }), h("slot", { name: "footer" }));
  }
  static get style() { return dialogContentCss; }
};

const dialogHeadersCss = ":host-context(.md){--dialog--header-font-size-default:20px;--dialog--subheader-font-size-default:16px}:host-context(.ios){--dialog--header-font-size-default:18px;--dialog--subheader-font-size-default:14px}:host{display:block;margin:16px;font-weight:var(--dialog--header-font-weight, 500);text-align:var(--dialog--text-align, left)}:host [ionx--header]{font-size:var(--dialog--header-font-size, var(--dialog--header-font-size-default))}:host [ionx--subheader]{font-size:var(--dialog--subheader-font-size, var(--dialog--subheader-font-size-default));opacity:0.7}";

let DialogHeaders = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return h(Host, null, this.header && h("div", { "ionx--header": true }, this.header), this.subheader && h("div", { "ionx--subheader": true }, this.subheader));
  }
  static get style() { return dialogHeadersCss; }
};

const dialogMessageCss = ":host{display:block;overflow:auto}";

let DialogMessage = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return h(Host, null, this.message && (this.message instanceof HtmlString ? h("div", { innerHTML: this.message.toString() }) : h("div", null, this.message)), h("slot", null));
  }
  static get style() { return dialogMessageCss; }
};

const IonxDialog = /*@__PURE__*/proxyCustomElement(Dialog, [0,"ionx-dialog",{"header":[1],"subheader":[1],"component":[1],"componentProps":[16],"message":[1],"messageComponent":[1,"message-component"],"messageComponentProps":[16],"buttons":[16],"prefetch":[4]},[[0,"ionViewDidEnter","ionDidEnter"]]]);
const IonxDialogButtons = /*@__PURE__*/proxyCustomElement(DialogButtons, [6,"ionx-dialog-buttons",{"buttons":[16],"prefetch":[4]}]);
const IonxDialogContent = /*@__PURE__*/proxyCustomElement(DialogContent, [1,"ionx-dialog-content"]);
const IonxDialogHeaders = /*@__PURE__*/proxyCustomElement(DialogHeaders, [1,"ionx-dialog-headers",{"header":[1],"subheader":[1]}]);
const IonxDialogMessage = /*@__PURE__*/proxyCustomElement(DialogMessage, [1,"ionx-dialog-message",{"message":[1]}]);
const defineIonxDialog = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxDialog,
  IonxDialogButtons,
  IonxDialogContent,
  IonxDialogHeaders,
  IonxDialogMessage
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxDialog, IonxDialogButtons, IonxDialogContent, IonxDialogHeaders, IonxDialogMessage, defineIonxDialog, dialogValueAttribute, markAsDialogValue, showDialog };
