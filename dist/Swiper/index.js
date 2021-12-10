export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { Navigation, Pagination } from 'swiper';

const NavigationModule = (context) => {
  Navigation(context);
  context.extendParams({ navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } });
};

const PaginationModule = (context) => {
  Pagination(context);
  context.extendParams({ pagination: { el: ".swiper-pagination" } });
};

export { NavigationModule, PaginationModule };

import {IonxSwiper} from "./ionx-swiper";
import {IonxSwiperNavigation} from "./ionx-swiper-navigation";
import {IonxSwiperPagination} from "./ionx-swiper-pagination";
import {IonxSwiperSlide} from "./ionx-swiper-slide";
import {IonxSwiperSlides} from "./ionx-swiper-slides";
export function defineIonxSwiper() {
	if (typeof customElements === "undefined") { return; }
	[{tagName: "ionx-swiper", clazz: IonxSwiper}, {tagName: "ionx-swiper-navigation", clazz: IonxSwiperNavigation}, {tagName: "ionx-swiper-pagination", clazz: IonxSwiperPagination}, {tagName: "ionx-swiper-slide", clazz: IonxSwiperSlide}, {tagName: "ionx-swiper-slides", clazz: IonxSwiperSlides}].forEach(elem => {
		if (!customElements.get(elem.tagName)) { customElements.define(elem.tagName, elem.clazz) }
	});
}