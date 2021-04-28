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

        const wasLoaded = elementOrOptions.classList.contains(itemLoadedCssClass) || elementOrOptions.classList.contains(itemLoadingCssClass) || elementOrOptions.classList.contains(itemErrorCssClass);

        elementOrOptions.classList.add(itemPendingCssClass);
        elementOrOptions.classList.remove(itemErrorCssClass, itemLoadingCssClass, itemLoadedCssClass);
        styleParents(elementOrOptions, options?.styleParents);

        (elementOrOptions as HTMLElement & ExtendedItemElement).__lazyLoadOptions = Object.assign({}, options);

        if (wasLoaded) {
            ensureLazyLoad(elementOrOptions.closest<HTMLIonContentElement>("ion-content"));
        }

    } else if (arguments.length === 1) {
        return (element: T) => lazyLoadItem(element, elementOrOptions);
    }
}
