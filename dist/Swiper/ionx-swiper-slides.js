import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

let Slides = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(Host, { class: "swiper-wrapper" }, h("slot", null));
  }
};
Slides = /*@__PURE__*/ proxyCustomElement(Slides, [4, "ionx-swiper-slides"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-swiper-slides"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-swiper-slides":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Slides);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxSwiperSlides = Slides;
const defineCustomElement = defineCustomElement$1;

export { IonxSwiperSlides, defineCustomElement };
