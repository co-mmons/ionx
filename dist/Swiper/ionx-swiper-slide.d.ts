import type { Components, JSX } from "./types/components";

interface IonxSwiperSlide extends Components.IonxSwiperSlide, HTMLElement {}
export const IonxSwiperSlide: {
  prototype: IonxSwiperSlide;
  new (): IonxSwiperSlide;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
