import type { Components, JSX } from "./types/components";

interface IonxGridCol extends Components.IonxGridCol, HTMLElement {}
export const IonxGridCol: {
  prototype: IonxGridCol;
  new (): IonxGridCol;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
