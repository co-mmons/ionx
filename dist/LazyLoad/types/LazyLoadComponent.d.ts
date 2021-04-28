export declare class LazyLoad {
  element: HTMLIonxLazyLoadElement;
  observer: MutationObserver;
  connectedCallback(): void;
  initContent(): void;
  onMutation(_mutations: MutationRecord[]): void;
  disconnectedCallback(): void;
  render(): any;
}
