import type { Components, JSX } from "./types/components";

interface IonxGrid extends Components.IonxGrid, HTMLElement {}
export const IonxGrid: {
  prototype: IonxGrid;
  new (): IonxGrid;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
