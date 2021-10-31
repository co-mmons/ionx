import { ComponentInterface } from "@stencil/core";
import VirtualScroller from "virtual-scroller";
import { VirtualScrollerState } from "./VirtualScrollerState";
export declare class VirtualScrollerComponent implements ComponentInterface {
  element: HTMLElement;
  items: any[];
  renderItem: (item: any, index: number) => any;
  itemKey?: (item: any) => any;
  preserveScrollPositionOnPrependItems: boolean;
  estimatedItemHeight: number;
  state: VirtualScrollerState;
  prevState: VirtualScrollerState;
  didUpdateState: (prevState: VirtualScrollerState) => void;
  scroller: VirtualScroller;
  beforeItemsHeight: number;
  afterItemsHeight: number;
  itemsChanged(newItems: any[]): void;
  connectedCallback(): void;
  componentDidLoad(): void;
  componentDidRender(): void;
  disconnectedCallback(): void;
  render(): any;
}
