import {itemErrorCssClass, itemLoadedCssClass, itemLoadingCssClass, itemPendingCssClass} from "./cssClasses";
import {ExtendedItemElement} from "./ExtendedItemElement";
import {LazyLoadItemOptions} from "./LazyLoadItemOptions";
import {styleParents} from "./styleParents";

type RefCallback<T extends HTMLElement = HTMLElement> = (element: T) => void;

export function lazyLoadItem<T extends HTMLElement = HTMLElement>(options: LazyLoadItemOptions): RefCallback<T>;

export function lazyLoadItem<T extends HTMLElement = HTMLElement>(element: T, options: LazyLoadItemOptions): void;

export function lazyLoadItem<T extends HTMLElement = HTMLElement>(elementOrOptions: T | LazyLoadItemOptions, options?: LazyLoadItemOptions): void | RefCallback<T> {

    if (elementOrOptions instanceof HTMLElement) {

        elementOrOptions.classList.add(itemPendingCssClass);
        elementOrOptions.classList.remove(itemErrorCssClass, itemLoadingCssClass, itemLoadedCssClass);
        styleParents(elementOrOptions, options?.styleParents);

        (elementOrOptions as HTMLElement & ExtendedItemElement).__lazyLoadOptions = Object.assign({}, options);

    } else if (arguments.length === 1) {
        return (element: T) => lazyLoadItem(element, elementOrOptions);
    }
}
