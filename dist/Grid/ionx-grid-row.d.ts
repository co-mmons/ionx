import type { Components, JSX } from "./types/components";

interface IonxGridRow extends Components.IonxGridRow, HTMLElement {}
export const IonxGridRow: {
  prototype: IonxGridRow;
  new (): IonxGridRow;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
