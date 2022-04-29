import type { Components, JSX } from "./types/components";

interface IonxBlock extends Components.IonxBlock, HTMLElement {}
export const IonxBlock: {
  prototype: IonxBlock;
  new (): IonxBlock;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
