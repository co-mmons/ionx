import type { Components, JSX } from "./types/components";

interface IonxSwiperSlides extends Components.IonxSwiperSlides, HTMLElement {}
export const IonxSwiperSlides: {
  prototype: IonxSwiperSlides;
  new (): IonxSwiperSlides;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
