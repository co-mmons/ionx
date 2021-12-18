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
  scroller: VirtualScroller<HTMLElement, any>;
  beforeItemsHeight: number;
  afterItemsHeight: number;
  paused: boolean;
  itemsChanged(newItems: any[]): void;
  connectedCallback(): void;
  componentDidLoad(): Promise<void>;
  componentDidRender(): void;
  disconnectedCallback(): void;
  render(): any;
}
