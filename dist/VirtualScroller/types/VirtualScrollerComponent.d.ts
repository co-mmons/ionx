import { ComponentInterface } from "@stencil/core";
import VirtualScroller, { State } from "virtual-scroller";
export declare class VirtualScrollerComponent implements ComponentInterface {
  element: HTMLElement;
  items: any[];
  renderItem: (item: any, index: number) => any;
  itemKey?: (item: any) => any;
  preserveScrollPositionOnPrependItems: boolean;
  estimatedItemHeight: number;
  state: Partial<State<any>>;
  scroller: VirtualScroller<HTMLElement, any>;
  initScroller(): void;
  componentDidRender(): void;
  itemsChanged(items: any[], _old: any): void;
  componentShouldUpdate(_new: any, _old: any, propName: string): boolean | void;
  connectedCallback(): void;
  componentDidLoad(): Promise<void>;
  disconnectedCallback(): void;
  render(): any;
}
