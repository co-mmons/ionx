import type {Components as ionic} from "@ionic/core/components";
import {ExtendedContent} from "./ExtendedContent";

export interface EnsureLazyLoadOptions {
    retryError?: boolean;
}

export function ensureLazyLoad(options?: EnsureLazyLoadOptions);

export function ensureLazyLoad(content: HTMLElement & ionic.IonContent, options?: EnsureLazyLoadOptions);

export function ensureLazyLoad(contentOrOptions: (HTMLElement & ionic.IonContent) | EnsureLazyLoadOptions, options?: EnsureLazyLoadOptions) {

    const contentElements: Array<HTMLElement & ExtendedContent> | NodeListOf<HTMLElement & ExtendedContent> = contentOrOptions instanceof HTMLElement ? [contentOrOptions] : document.body.querySelectorAll<HTMLElement & ionic.IonContent>("ion-content");

    if (!(contentOrOptions instanceof HTMLElement)) {
        options = contentOrOptions;
    }

    for (let i = 0; i < contentElements.length; i++) {
        if (contentElements[i].__ionxLazyLoad) {
            contentElements[i].__ionxLazyLoad.ensureLoaded({retryError: options?.retryError});
        }
    }
}
