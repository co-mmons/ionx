import { HTMLElement, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { isPlatform } from '@ionic/core';
import tippy from 'tippy.js';

class TooltipErrorPresenter {
  constructor(options) {
    this.options = options;
  }
  async present(controller, errorControl) {
    this.destroyTippy();
    this.instance = tippy(errorControl.element, Object.assign({
      arrow: true,
      placement: "bottom",
      trigger: "manual",
      hideOnClick: true,
      theme: isPlatform("ios") ? "light-border" : "material"
    }, this.options, { content: errorControl.error.message }));
    this.lastErrorSubscription = errorControl.stateChanges.subscribe(state => !(state.current.touched && state.previous.untouched) && this.dismiss(controller));
    this.instance.show();
  }
  async dismiss(_controller) {
    this.destroyTippy();
  }
  destroyTippy() {
    if (this.lastErrorSubscription) {
      this.lastErrorSubscription.unsubscribe();
      this.lastErrorSubscription = undefined;
    }
    if (this.instance) {
      this.instance.destroy();
      this.instance = undefined;
    }
  }
}

const tooltipErrorPresenterCss = ".tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;white-space:normal;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:\"\";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}.tippy-box[data-theme~=light-border]{background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,8,16,.15);color:#333;box-shadow:0 4px 14px -2px rgba(0,8,16,.08)}.tippy-box[data-theme~=light-border]>.tippy-backdrop{background-color:#fff}.tippy-box[data-theme~=light-border]>.tippy-arrow:after,.tippy-box[data-theme~=light-border]>.tippy-svg-arrow:after{content:\"\";position:absolute;z-index:-1}.tippy-box[data-theme~=light-border]>.tippy-arrow:after{border-color:transparent;border-style:solid}.tippy-box[data-theme~=light-border][data-placement^=top]>.tippy-arrow:before{border-top-color:#fff}.tippy-box[data-theme~=light-border][data-placement^=top]>.tippy-arrow:after{border-top-color:rgba(0,8,16,.2);border-width:7px 7px 0;top:17px;left:1px}.tippy-box[data-theme~=light-border][data-placement^=top]>.tippy-svg-arrow>svg{top:16px}.tippy-box[data-theme~=light-border][data-placement^=top]>.tippy-svg-arrow:after{top:17px}.tippy-box[data-theme~=light-border][data-placement^=bottom]>.tippy-arrow:before{border-bottom-color:#fff;bottom:16px}.tippy-box[data-theme~=light-border][data-placement^=bottom]>.tippy-arrow:after{border-bottom-color:rgba(0,8,16,.2);border-width:0 7px 7px;bottom:17px;left:1px}.tippy-box[data-theme~=light-border][data-placement^=bottom]>.tippy-svg-arrow>svg{bottom:16px}.tippy-box[data-theme~=light-border][data-placement^=bottom]>.tippy-svg-arrow:after{bottom:17px}.tippy-box[data-theme~=light-border][data-placement^=left]>.tippy-arrow:before{border-left-color:#fff}.tippy-box[data-theme~=light-border][data-placement^=left]>.tippy-arrow:after{border-left-color:rgba(0,8,16,.2);border-width:7px 0 7px 7px;left:17px;top:1px}.tippy-box[data-theme~=light-border][data-placement^=left]>.tippy-svg-arrow>svg{left:11px}.tippy-box[data-theme~=light-border][data-placement^=left]>.tippy-svg-arrow:after{left:12px}.tippy-box[data-theme~=light-border][data-placement^=right]>.tippy-arrow:before{border-right-color:#fff;right:16px}.tippy-box[data-theme~=light-border][data-placement^=right]>.tippy-arrow:after{border-width:7px 7px 7px 0;right:17px;top:1px;border-right-color:rgba(0,8,16,.2)}.tippy-box[data-theme~=light-border][data-placement^=right]>.tippy-svg-arrow>svg{right:11px}.tippy-box[data-theme~=light-border][data-placement^=right]>.tippy-svg-arrow:after{right:12px}.tippy-box[data-theme~=light-border]>.tippy-svg-arrow{fill:#fff}.tippy-box[data-theme~=light-border]>.tippy-svg-arrow:after{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA2czEuNzk2LS4wMTMgNC42Ny0zLjYxNUM1Ljg1MS45IDYuOTMuMDA2IDggMGMxLjA3LS4wMDYgMi4xNDguODg3IDMuMzQzIDIuMzg1QzE0LjIzMyA2LjAwNSAxNiA2IDE2IDZIMHoiIGZpbGw9InJnYmEoMCwgOCwgMTYsIDAuMikiLz48L3N2Zz4=);background-size:16px 6px;width:16px;height:6px}.tippy-box[data-theme~=material]{background-color:#505355;font-weight:600}.tippy-box[data-theme~=material][data-placement^=top]>.tippy-arrow:before{border-top-color:#505355}.tippy-box[data-theme~=material][data-placement^=bottom]>.tippy-arrow:before{border-bottom-color:#505355}.tippy-box[data-theme~=material][data-placement^=left]>.tippy-arrow:before{border-left-color:#505355}.tippy-box[data-theme~=material][data-placement^=right]>.tippy-arrow:before{border-right-color:#505355}.tippy-box[data-theme~=material]>.tippy-backdrop{background-color:#505355}.tippy-box[data-theme~=material]>.tippy-svg-arrow{fill:#505355}div[data-tippy-root]{z-index:30000 !important}";

let TooltipErrorPresenterComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  connectedCallback() {
    if (!this.instance$ && this.instance !== false) {
      this.instance$ = this.instance ? this.instance : new TooltipErrorPresenter();
    }
    if (this.instance$) {
      const form = this.element.closest("ionx-form-controller");
      if (form?.controller) {
        form.controller.errorPresenter = this.instance$;
      }
    }
  }
  disconnectedCallback() {
  }
  get element() { return this; }
  static get style() { return tooltipErrorPresenterCss; }
};

const IonxFormTooltipErrorPresenter = /*@__PURE__*/proxyCustomElement(TooltipErrorPresenterComponent, [0,"ionx-form-tooltip-error-presenter",{"instance":[4],"options":[16]}]);
const defineIonxFormsTooltipErrorPresenter = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxFormTooltipErrorPresenter
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxFormTooltipErrorPresenter, TooltipErrorPresenter, defineIonxFormsTooltipErrorPresenter };
