import { LazyLoadItemOptions } from "./LazyLoadItemOptions";
declare type RefCallback<T extends HTMLElement = HTMLElement> = (element: T) => void;
export declare function lazyLoadItem<T extends HTMLElement = HTMLElement>(options: LazyLoadItemOptions): RefCallback<T>;
export declare function lazyLoadItem<T extends HTMLElement = HTMLElement>(element: T, options: LazyLoadItemOptions): void;
export {};
