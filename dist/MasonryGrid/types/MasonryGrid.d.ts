import type { Components as ionic } from "@ionic/core";
import { ComponentInterface } from "@stencil/core";
import { EventUnlisten } from "ionx/utils";
import { WidthBreakpointsContainer } from "ionx/WidthBreakpoints";
import { ExtendedItemElement } from "./ExtendedItemElement";
export declare class MasonryGrid implements ComponentInterface {
  element: HTMLElement;
  block: boolean;
  busy: boolean;
  /**
   * If at least one layout call is waiting.
   */
  waiting: boolean;
  breakpoints: WidthBreakpointsContainer;
  mutationObserver: MutationObserver;
  resizeObserver: ResizeObserver;
  /**
   * Ostatnia ilość itemów w gridzie (żeby wiedzieć, czy trzeba przebudować).
   */
  lastItemsCount: number;
  /**
   * Ostatnia szerokość gridu (żeby wiedzieć, czy trzeba przebudować).
   */
  lastWidth: number;
  /**
   * Czy przebudowa gridu została zlecona gdy widok był niewidoczny albo pauzowany.
   */
  queuedArrange: boolean;
  contentElement: HTMLElement & ionic.IonContent;
  parentViewElement: HTMLElement;
  paused: boolean;
  pauseUnlisten: EventUnlisten;
  resumeUnlisten: EventUnlisten;
  viewDidEnterUnlisten: EventUnlisten;
  itemsElement: HTMLElement;
  isParentViewActive(): boolean;
  items(): (HTMLElement & ExtendedItemElement)[];
  markItemAsDirty(item: HTMLElement): Promise<void>;
  arrange(options?: {
    force?: boolean;
    trigger?: "onresize";
  }): Promise<void>;
  protected resized(event: CustomEvent): Promise<void>;
  viewPaused(): void;
  viewResumed(): void;
  viewDidEnter(): void;
  visibilityChanged(): void;
  onMutation(_mutations: MutationRecord[]): void;
  connectedCallback(): void;
  init(): void;
  disconnectedCallback(): void;
  render(): any;
}
