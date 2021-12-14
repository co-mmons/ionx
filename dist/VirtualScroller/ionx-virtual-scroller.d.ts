import type { Components, JSX } from "./types/components";

interface IonxVirtualScroller extends Components.IonxVirtualScroller, HTMLElement {}
export const IonxVirtualScroller: {
  prototype: IonxVirtualScroller;
  new (): IonxVirtualScroller;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
