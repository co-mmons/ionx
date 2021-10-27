/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Swiper, SwiperOptions } from "swiper";
import { SwiperEvents } from "swiper/types";
export namespace Components {
    interface IonxSwiper {
        /**
          * Return the Swiper instance but making sure, that it was initialized. When accessing {@link #swiper} it can return undefined when not yet initialized.
         */
        "asyncSwiper": () => Promise<Swiper>;
        "options"?: SwiperOptions;
        /**
          * Swiper instance set in constructor of new Swiper instance. It is set as Prop, but should be treated as readonly.
         */
        "swiper": Swiper;
        /**
          * Update the underlying slider implementation. Call this if you've added or removed child slides.
         */
        "update": () => Promise<void>;
    }
    interface IonxSwiperNavigation {
        "hideOnMobile": boolean;
    }
    interface IonxSwiperPagination {
    }
    interface IonxSwiperSlide {
    }
    interface IonxSwiperSlides {
    }
}
declare global {
    interface HTMLIonxSwiperElement extends Components.IonxSwiper, HTMLStencilElement {
    }
    var HTMLIonxSwiperElement: {
        prototype: HTMLIonxSwiperElement;
        new (): HTMLIonxSwiperElement;
    };
    interface HTMLIonxSwiperNavigationElement extends Components.IonxSwiperNavigation, HTMLStencilElement {
    }
    var HTMLIonxSwiperNavigationElement: {
        prototype: HTMLIonxSwiperNavigationElement;
        new (): HTMLIonxSwiperNavigationElement;
    };
    interface HTMLIonxSwiperPaginationElement extends Components.IonxSwiperPagination, HTMLStencilElement {
    }
    var HTMLIonxSwiperPaginationElement: {
        prototype: HTMLIonxSwiperPaginationElement;
        new (): HTMLIonxSwiperPaginationElement;
    };
    interface HTMLIonxSwiperSlideElement extends Components.IonxSwiperSlide, HTMLStencilElement {
    }
    var HTMLIonxSwiperSlideElement: {
        prototype: HTMLIonxSwiperSlideElement;
        new (): HTMLIonxSwiperSlideElement;
    };
    interface HTMLIonxSwiperSlidesElement extends Components.IonxSwiperSlides, HTMLStencilElement {
    }
    var HTMLIonxSwiperSlidesElement: {
        prototype: HTMLIonxSwiperSlidesElement;
        new (): HTMLIonxSwiperSlidesElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-swiper": HTMLIonxSwiperElement;
        "ionx-swiper-navigation": HTMLIonxSwiperNavigationElement;
        "ionx-swiper-pagination": HTMLIonxSwiperPaginationElement;
        "ionx-swiper-slide": HTMLIonxSwiperSlideElement;
        "ionx-swiper-slides": HTMLIonxSwiperSlidesElement;
    }
}
declare namespace LocalJSX {
    interface IonxSwiper {
        "onSwiperEvent"?: (event: CustomEvent<{eventName: keyof SwiperEvents}>) => void;
        "options"?: SwiperOptions;
        /**
          * Swiper instance set in constructor of new Swiper instance. It is set as Prop, but should be treated as readonly.
         */
        "swiper"?: Swiper;
    }
    interface IonxSwiperNavigation {
        "hideOnMobile"?: boolean;
    }
    interface IonxSwiperPagination {
    }
    interface IonxSwiperSlide {
    }
    interface IonxSwiperSlides {
    }
    interface IntrinsicElements {
        "ionx-swiper": IonxSwiper;
        "ionx-swiper-navigation": IonxSwiperNavigation;
        "ionx-swiper-pagination": IonxSwiperPagination;
        "ionx-swiper-slide": IonxSwiperSlide;
        "ionx-swiper-slides": IonxSwiperSlides;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-swiper": LocalJSX.IonxSwiper & JSXBase.HTMLAttributes<HTMLIonxSwiperElement>;
            "ionx-swiper-navigation": LocalJSX.IonxSwiperNavigation & JSXBase.HTMLAttributes<HTMLIonxSwiperNavigationElement>;
            "ionx-swiper-pagination": LocalJSX.IonxSwiperPagination & JSXBase.HTMLAttributes<HTMLIonxSwiperPaginationElement>;
            "ionx-swiper-slide": LocalJSX.IonxSwiperSlide & JSXBase.HTMLAttributes<HTMLIonxSwiperSlideElement>;
            "ionx-swiper-slides": LocalJSX.IonxSwiperSlides & JSXBase.HTMLAttributes<HTMLIonxSwiperSlidesElement>;
        }
    }
}