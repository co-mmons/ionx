import type { Components, JSX } from "./types/components";

interface IonxSwiperNavigation extends Components.IonxSwiperNavigation, HTMLElement {}
export const IonxSwiperNavigation: {
  prototype: IonxSwiperNavigation;
  new (): IonxSwiperNavigation;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
