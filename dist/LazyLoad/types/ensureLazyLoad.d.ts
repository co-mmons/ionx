import type { Components as ionic } from "@ionic/core";
export interface EnsureLazyLoadOptions {
  retryError?: boolean;
}
export declare function ensureLazyLoad(options?: EnsureLazyLoadOptions): any;
export declare function ensureLazyLoad(content: HTMLElement & ionic.IonContent, options?: EnsureLazyLoadOptions): any;
