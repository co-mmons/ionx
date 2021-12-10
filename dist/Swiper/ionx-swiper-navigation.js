import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const navigationComponentCss = ":root{--swiper-navigation-size:44px;}.swiper-button-prev,.swiper-button-next{position:absolute;top:50%;width:calc(var(--swiper-navigation-size) / 44 * 27);height:var(--swiper-navigation-size);margin-top:calc(0px - var(--swiper-navigation-size) / 2);z-index:10;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--swiper-navigation-color, var(--swiper-theme-color))}.swiper-button-prev.swiper-button-disabled,.swiper-button-next.swiper-button-disabled{opacity:0.35;cursor:auto;pointer-events:none}.swiper-button-prev:after,.swiper-button-next:after{font-family:swiper-icons;font-size:var(--swiper-navigation-size);text-transform:none !important;letter-spacing:0;text-transform:none;font-variant:initial;line-height:1}.swiper-button-prev,.swiper-rtl .swiper-button-next{left:10px;right:auto}.swiper-button-prev:after,.swiper-rtl .swiper-button-next:after{content:\"prev\"}.swiper-button-next,.swiper-rtl .swiper-button-prev{right:10px;left:auto}.swiper-button-next:after,.swiper-rtl .swiper-button-prev:after{content:\"next\"}.swiper-button-lock{display:none}ionx-swiper-navigation{display:block;--swiper-navigation-color:#fff}ionx-swiper-navigation .swiper-button-next.swiper-button-disabled,ionx-swiper-navigation .swiper-button-prev.swiper-button-disabled{pointer-events:initial}ionx-swiper-navigation .swiper-button-next:not(.swiper-button-disabled),ionx-swiper-navigation .swiper-button-prev:not(.swiper-button-disabled){text-shadow:0 0 6px #000}ionx-swiper:not(.swiper-initialized) ionx-swiper-navigation,.plt-mobile ionx-swiper-navigation.ionx--hide-on-mobile{display:none}";

let NavigationComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(Host, { class: { "ionx--hide-on-mobile": this.hideOnMobile } }, h("div", { class: "swiper-button-prev" }), h("div", { class: "swiper-button-next" }));
  }
  get element() { return this; }
  static get style() { return navigationComponentCss; }
};
NavigationComponent = /*@__PURE__*/ proxyCustomElement(NavigationComponent, [0, "ionx-swiper-navigation", {
    "hideOnMobile": [4, "hide-on-mobile"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-swiper-navigation"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-swiper-navigation":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, NavigationComponent);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxSwiperNavigation = NavigationComponent;
const defineCustomElement = defineCustomElement$1;

export { IonxSwiperNavigation, defineCustomElement };
