import type { Components as ionic } from "@ionic/core";
import { EventUnlisten } from "ionx/utils";
export declare class LazyLoadController {
  constructor(content: HTMLElement & ionic.IonContent);
  private content;
  private intersectionObserver;
  private mutationObserver;
  private items;
  private errors;
  resumeUnlisten: EventUnlisten;
  private containers;
  private callback;
  private loadItem;
  connectContainer(containerElement: HTMLIonxLazyLoadElement): void;
  disconnectContainer(container: HTMLIonxLazyLoadElement): void;
  ensureLoaded(options?: {
    retryError?: boolean;
  }): Promise<void>;
  private init;
  disconnect(): void;
}
