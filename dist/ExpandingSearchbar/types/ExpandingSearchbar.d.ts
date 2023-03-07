import { ComponentInterface } from "@stencil/core";
import { EventUnlisten } from "ionx/utils";
import type { Components } from "@ionic/core/components";
export declare class ExpandingSearchbar implements ComponentInterface {
  element: HTMLElement;
  expanded: boolean;
  expand(): Promise<void>;
  onExpand(): void;
  get searchbar(): HTMLElement & Components.IonSearchbar;
  onClearUnlisten: EventUnlisten;
  collapseIfPossible(cleared?: boolean): void;
  applyState(): void;
  componentWillLoad(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
