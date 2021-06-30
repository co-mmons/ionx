export declare class LazyLoad {
  element: HTMLIonxLazyLoadElement;
  container?: "parent" | "self" | "content";
  observeShadow?: boolean;
  observers: MutationObserver[];
  connectedCallback(): void;
  initObservers(): Promise<void>;
  initContent(): void;
  onMutation(_mutations: MutationRecord[]): void;
  disconnectedCallback(): void;
  render(): any;
}
