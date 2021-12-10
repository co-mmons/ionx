import type { Components, JSX } from "./types/components";

interface IonxSwiper extends Components.IonxSwiper, HTMLElement {}
export const IonxSwiper: {
  prototype: IonxSwiper;
  new (): IonxSwiper;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
