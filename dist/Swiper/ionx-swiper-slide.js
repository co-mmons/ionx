import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const slideCss = "ionx-swiper-slide{display:block}";

let Slide = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(Host, { class: "swiper-slide" }, h("slot", null));
  }
  get element() { return this; }
  static get style() { return slideCss; }
};
Slide = /*@__PURE__*/ proxyCustomElement(Slide, [4, "ionx-swiper-slide"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-swiper-slide"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-swiper-slide":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Slide);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxSwiperSlide = Slide;
const defineCustomElement = defineCustomElement$1;

export { IonxSwiperSlide, defineCustomElement };
