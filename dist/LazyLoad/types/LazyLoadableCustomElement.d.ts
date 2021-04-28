export interface LazyLoadableCustomElement {
  lazyLoad?(options?: {}): Promise<void>;
}
