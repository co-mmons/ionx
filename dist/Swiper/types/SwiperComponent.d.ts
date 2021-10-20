import { ComponentInterface, EventEmitter } from "@stencil/core";
import { Swiper, SwiperOptions } from "swiper";
import { SwiperEvents } from "swiper/types";
export declare class SwiperComponent implements ComponentInterface {
  element: HTMLElement;
  options?: SwiperOptions;
  swiperEvent: EventEmitter<{
    eventName: keyof SwiperEvents;
  }>;
  mutationObserver?: MutationObserver;
  /**
   * Swiper instance set in constructor of new Swiper instance.
   * It is set as Prop, but should be treated as readonly.
   *
   * @internal
   */
  readonly swiper: Swiper;
  /**
   * Return the Swiper instance but making sure, that it was initialized.
   * When accessing {@link #swiper} it can return undefined when not yet initialized.
   */
  asyncSwiper(): Promise<Swiper>;
  /**
   * Update the underlying slider implementation. Call this if you've added or removed
   * child slides.
   */
  update(): Promise<void>;
  optionsChanged(niu: SwiperOptions, old: SwiperOptions): Promise<void>;
  private normalizeOptions;
  initSwiper(): Promise<void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
