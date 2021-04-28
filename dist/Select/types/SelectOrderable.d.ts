import { EventEmitter } from "@stencil/core";
import dragula from "dragula";
export declare class SelectOrderable {
  element: HTMLElement;
  instance: dragula.Drake;
  enabled: boolean;
  values: any[];
  orderChanged: EventEmitter<any[]>;
  watchEnabled(): Promise<void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
}
