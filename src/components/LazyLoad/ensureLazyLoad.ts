import {ExtendedContent} from "./ExtendedContent";

export interface EnsureLazyLoadOptions {
    retryError?: boolean;
}

export function ensureLazyLoad(options?: EnsureLazyLoadOptions);

export function ensureLazyLoad(content: HTMLIonContentElement, options?: EnsureLazyLoadOptions);

export function ensureLazyLoad(contentOrOptions: HTMLIonContentElement | EnsureLazyLoadOptions, options?: EnsureLazyLoadOptions) {

    const contentElements: Array<HTMLElement & ExtendedContent> | NodeListOf<HTMLElement & ExtendedContent> = contentOrOptions instanceof HTMLElement ? [contentOrOptions] : document.body.querySelectorAll<HTMLIonContentElement>("ion-content");

    if (!(contentOrOptions instanceof HTMLElement)) {
        options = contentOrOptions;
    }

    for (let i = 0; i < contentElements.length; i++) {
        if (contentElements[i].__ionxLazyLoad) {
            contentElements[i].__ionxLazyLoad.checkItems({retryError: options?.retryError});
        }
    }
}
