import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { popoverController } from '@ionic/core';
import { intl } from '@co.mmons/js-intl';

class LoadingProxy {
  constructor(element) {
    this.element = element;
    this.loading = element.tagName === "IONX-LOADING" ? element : undefined;
  }
  async dismiss() {
    if (this.loading) {
      return this.loading.dismiss();
    }
    else {
      if (this.element.style.opacity === "0" || this.element.style.opacity.startsWith("-")) {
        this.element.remove();
      }
      else {
        this.element.style.opacity = `${parseFloat(this.element.style.opacity || "1.0") - .1}`;
        requestAnimationFrame(() => this.dismiss());
      }
    }
  }
  get backdropVisible() {
    if (this.loading) {
      return this.loading.backdropVisible;
    }
    else {
      return true;
    }
  }
  set backdropVisible(visible) {
    if (this.loading) {
      this.loading.backdropVisible = visible;
    }
  }
  get header() {
    if (this.loading) {
      return this.loading.header;
    }
    else {
      return undefined;
    }
  }
  set header(header) {
    if (this.loading) {
      this.loading.header = header;
    }
  }
  get message() {
    if (this.loading) {
      return this.loading.message;
    }
  }
  set message(message) {
    if (this.loading) {
      this.loading.message = message;
    }
  }
  get progressBuffer() {
    if (this.loading) {
      return this.loading.progressBuffer;
    }
  }
  set progressBuffer(buffer) {
    if (this.loading) {
      this.loading.progressBuffer = buffer;
    }
  }
  get progressMessage() {
    if (this.loading) {
      return this.loading.progressMessage;
    }
  }
  set progressMessage(message) {
    if (this.loading) {
      this.loading.progressMessage = message;
    }
  }
  get progressPercent() {
    if (this.loading) {
      return this.loading.progressPercent;
    }
  }
  set progressPercent(progress) {
    if (this.loading) {
      this.loading.progressPercent = progress;
    }
  }
  get progressType() {
    if (this.loading) {
      return this.loading.progressType;
    }
  }
  set progressType(type) {
    if (this.loading) {
      this.loading.progressType = type;
    }
  }
  get progressValue() {
    if (this.loading) {
      return this.loading.progressValue;
    }
  }
  set progressValue(value) {
    if (this.loading) {
      this.loading.progressValue = value;
    }
  }
  get type() {
    if (this.loading) {
      return this.loading.type;
    }
  }
  set type(type) {
    if (this.loading) {
      this.loading.type = type;
    }
  }
}

async function showLoadingOverlay(options) {
  if (!(options === null || options === void 0 ? void 0 : options.type)) {
    const app = document.querySelector("ion-app");
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = `rgba(${(options === null || options === void 0 ? void 0 : options.backdropTheme) === "light" ? "255,255,255, 0.5" : "0,0,0,.32"})`;
    overlay.style.zIndex = "19999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    app.appendChild(overlay);
    const spinner = document.createElement("ion-spinner");
    spinner.style.color = (options === null || options === void 0 ? void 0 : options.backdropTheme) === "light" ? "#000" : "#fff";
    overlay.appendChild(spinner);
    return new LoadingProxy(overlay);
  }
  else {
    const popover = await popoverController.create({
      animated: false,
      cssClass: "ionx-loading-popover",
      showBackdrop: typeof (options === null || options === void 0 ? void 0 : options.backdropVisible) === "boolean" ? options.backdropVisible : true,
      backdropDismiss: false,
      keyboardClose: false,
      component: "ionx-loading",
      componentProps: Object.assign({ type: "spinner" }, options, { backdropVisible: false })
    });
    popover.style.setProperty("--width", "auto");
    const wrapper = popover.querySelector(".popover-content");
    wrapper.style.padding = "16px";
    await popover.present();
    return new LoadingProxy(popover.querySelector("ionx-loading"));
  }
}

const loadingCss = "ionx-loading{display:flex;align-items:center;--loading-backdrop-opacity:0.8}ionx-loading[cover]{position:absolute;width:100%;height:100%;align-items:center;align-content:center;justify-items:center;justify-content:center;top:0px;left:0px}ionx-loading.ionx--backdrop-visible{background-color:rgba(var(--loading-backdrop-color, var(--ion-background-color-rgb)), var(--loading-backdrop-opacity))}.ionx-loading-popover .popover-wrapper{display:flex;align-content:center;justify-content:center;align-items:center;justify-items:center}.ionx-loading-popover .popover-content{position:initial}";

const Loading = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    /**
     * @inheritDoc
     */
    this.type = "spinner";
    this.progressType = "determinate";
    this.progressValue = 0;
    this.progressBuffer = 0;
  }
  get progressPercentVisible() {
    return typeof this.progressPercent === "number";
  }
  get spinnerMode() {
    return this.type === "spinner";
  }
  get progressMode() {
    return this.type === "progress";
  }
  async dismiss() {
    const popover = this.el.closest("ion-popover");
    if (popover) {
      popover.dismiss();
    }
  }
  render() {
    const styles = {};
    if (this.backdropOpacity > 0) {
      styles["--loading-backdrop-opacity"] = `${this.backdropOpacity}`;
    }
    if (this.backdropTheme === "dark") {
      styles["--loading-backdrop-color"] = "0,0,0";
    }
    return h(Host, { class: { "ionx--backdrop-visible": this.backdropVisible }, style: styles }, h("div", { style: { display: "flex", alignItems: "center", flexWrap: "wrap", flex: this.cover ? "initial" : "1" } }, this.spinnerMode && h("ion-spinner", { color: this.color, style: { marginRight: !!(this.header || this.message) && "8px" } }), !!(this.header || this.message) && h("div", { style: { flexBasis: this.progressMode && "100%", display: "flex", flexDirection: "column", justifyItems: "center", flex: "1" } }, this.header ? h("h4", { style: { "margin": "0px" } }, this.header) : "", this.message ? h("ion-text", { color: this.color, innerHTML: this.message }) : ""), this.progressMode && h("ion-progress-bar", { color: this.color, style: { flexBasis: "100%", marginTop: !!(this.header || this.message) && "8px" }, value: this.progressValue, type: this.progressType, buffer: this.progressBuffer }), (!!this.progressMessage || this.progressPercentVisible) && h("div", { style: { display: "flex", flex: "1", marginTop: "8px" } }, h("ion-text", { color: this.color, innerHTML: this.progressMessage, style: { flex: "1" } }), this.progressPercentVisible && h("span", { style: { width: "60px", textAlign: "right" } }, intl.percentFormat(this.progressPercent, { maximumFractionDigits: 0 })))));
  }
  get el() { return this; }
  static get style() { return loadingCss; }
};

const IonxLoading = /*@__PURE__*/proxyCustomElement(Loading, [0,"ionx-loading",{"cover":[516],"backdropVisible":[4,"backdrop-visible"],"backdropTheme":[1,"backdrop-theme"],"backdropOpacity":[2,"backdrop-opacity"],"header":[1],"message":[1],"type":[1],"progressMessage":[1,"progress-message"],"progressType":[1,"progress-type"],"progressValue":[2,"progress-value"],"progressBuffer":[2,"progress-buffer"],"progressPercent":[2,"progress-percent"],"color":[1]}]);
const defineIonxLoading = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxLoading
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxLoading, defineIonxLoading, showLoadingOverlay };
