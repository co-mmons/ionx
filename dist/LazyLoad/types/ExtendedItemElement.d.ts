import { LazyLoadItemOptions } from "./LazyLoadItemOptions";
export interface ExtendedItemElement {
  __lazyLoadOptions?: LazyLoadItemOptions;
  /**
   * Last src that was applied to an element. Only when lazy loading
   * an element that doesn't support src attribute (e.g. div).
   */
  __lazyLoadSrc?: string;
}
