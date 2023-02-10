import type {Components as ionic} from "@ionic/core/components";
import {deepEqual} from "fast-equals";
import {itemErrorCssClass, itemLoadedCssClass, itemLoadingCssClass, itemPendingCssClass} from "./cssClasses";
import {ensureLazyLoad} from "./ensureLazyLoad";
import {ExtendedItemElement} from "./ExtendedItemElement";
import {LazyLoadItemOptions} from "./LazyLoadItemOptions";
import {styleParents} from "./styleParents";

type RefCallback<T extends HTMLElement = HTMLElement> = (element: T) => void;

export function lazyLoadItem<T extends HTMLElement = HTMLElement>(options: LazyLoadItemOptions): RefCallback<T>;

export function lazyLoadItem<T extends HTMLElement = HTMLElement>(element: T, options: LazyLoadItemOptions): void;

export function lazyLoadItem<T extends HTMLElement = HTMLElement>(elementOrOptions: T | LazyLoadItemOptions, options?: LazyLoadItemOptions): void | RefCallback<T> {

    if (elementOrOptions instanceof HTMLElement) {

        const element = elementOrOptions as HTMLElement & ExtendedItemElement;
        const isLoaded = element.classList.contains(itemLoadedCssClass);

        if (isLoaded && deepEqual(element.__lazyLoadOptions, options)) {
            return;
        }

        const wasLoaded = isLoaded || element.classList.contains(itemLoadingCssClass) || element.classList.contains(itemErrorCssClass);

        element.classList.add(itemPendingCssClass);
        element.classList.remove(itemErrorCssClass, itemLoadingCssClass, itemLoadedCssClass);
        styleParents(element, options?.styleParents);

        element.__lazyLoadOptions = Object.assign({}, options);

        if (wasLoaded) {
            ensureLazyLoad(element.closest<HTMLElement & ionic.IonContent>("ion-content"));
        }

    } else if (arguments.length === 1) {
        return (element: T) => lazyLoadItem(element, elementOrOptions);
    }
}
