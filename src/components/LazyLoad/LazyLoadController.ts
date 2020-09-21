import {itemErrorCssClass, itemLoadedCssClass, itemLoadingCssClass, itemPendingCssClass} from "./cssClasses";
import {ExtendedContent} from "./ExtendedContent";
import {ExtendedItemElement} from "./ExtendedItemElement";
import {LazyLoadableCustomElement} from "./LazyLoadableCustomElement";
import {styleParents} from "./styleParents";

const srcSupportedTagNames = ["IMG", "VIDEO", "IFRAME"];

export class LazyLoadController {

    constructor(content: HTMLIonContentElement) {
        this.content = content;
        this.init();
    }

    private content: HTMLIonContentElement & ExtendedContent;

    private observer: IntersectionObserver;

    private items: HTMLCollectionOf<Element>;

    private containers: HTMLIonxLazyLoadElement[] = [];

    private callback(entries: IntersectionObserverEntry[]) {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                setTimeout(() => this.loadItem(entry.target));
            }
        }
    }

    private loadItem(element: Element & LazyLoadableCustomElement & ExtendedItemElement) {

        const srcSupported = srcSupportedTagNames.includes(element.tagName);
        const options = element.__lazyLoadOptions;

        delete element.__lazyLoadSrc;

        element.classList.remove(itemPendingCssClass);
        element.classList.add(itemLoadingCssClass);

        styleParents(element, options?.styleParents);

        const load = (afterError: boolean) => {

            if (element.lazyLoad) {

                if (!afterError) {
                    element.lazyLoad(options);
                } else {
                    markAsError();
                }

            } else if (options?.src) {

                const src = Array.isArray(options.src) ? options.src : [options.src];

                if (src.length === 0) {
                    console.warn("[ionx-lazy-load] element cannot be lazy loaded, no src given", element);
                    markAsError();

                } else {

                    const lastSrcIndex = src.lastIndexOf((srcSupported && element.getAttribute("src")) || element.__lazyLoadSrc || null);

                    if (lastSrcIndex >= src.length - 1) {
                        markAsError();
                    } else if (srcSupported) {
                        element.setAttribute("src", src[lastSrcIndex + 1]);
                    } else {
                        const img = new Image();
                        img.addEventListener("error", onItemError);
                        img.addEventListener("load", onItemLoad);
                        element.__lazyLoadSrc = img.src = src[lastSrcIndex + 1];
                    }
                }
            }
        }

        const markAsError = () => {
            element.classList.add(itemErrorCssClass);
            element.classList.remove(itemLoadedCssClass, itemPendingCssClass, itemLoadingCssClass);
            styleParents(element, options?.styleParents);

            element.removeEventListener("load", onItemLoad);
            element.removeEventListener("error", onItemError);

            this.observer.unobserve(element);
        }

        const onItemError = (_ev: Event) => {

            const target = _ev.target as Element;

            if (target !== element) {
                target.removeEventListener("load", onItemLoad);
                target.removeEventListener("error", onItemError);
            }

            load(true);
        }

        const onItemLoad = (_ev: Event) => {

            const target = _ev.target as Element;

            element.classList.add(itemLoadedCssClass);
            element.classList.remove(itemPendingCssClass, itemLoadingCssClass, itemErrorCssClass);
            styleParents(element, options?.styleParents);

            this.observer.unobserve(element);

            target.removeEventListener("load", onItemLoad);
            target.removeEventListener("error", onItemError);
            element.removeEventListener("load", onItemLoad);
            element.removeEventListener("error", onItemError);

            if (target !== element) {
                (element as HTMLElement).style.backgroundImage = `url(${target.getAttribute("src")})`;
            }
        }

        if (srcSupported || element.lazyLoad) {
            element.addEventListener("error", onItemError);
            element.addEventListener("load", onItemLoad);
        }

        load(false);
    }

    connectContainer(container: HTMLIonxLazyLoadElement) {

        if (!this.containers.includes(container)) {
            this.containers.push(container);
        }

        this.ensureLoaded();
    }

    disconnectContainer(container: HTMLIonxLazyLoadElement) {

        const idx = this.containers.indexOf(container);
        if (idx > -1) {
            this.containers.splice(idx, 1);
        }

        if (this.containers.length === 0) {
            this.disconnect();
        }
    }

    ensureLoaded(options?: {retryError?: boolean}) {

        if (options?.retryError) {
            const errors = this.content.getElementsByClassName(itemErrorCssClass);
            for (let i = 0; i < errors.length; i++) {
                const item = errors[i];
                item.classList.add(itemPendingCssClass);
                item.classList.remove(itemErrorCssClass);
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            this.observer.observe(this.items[i]);
        }
    }

    private init() {

        this.observer = new IntersectionObserver(entries => this.callback(entries), {
            root: this.content
        });

        this.items = this.content.getElementsByClassName("ionx-lazy-load-pending");
    }

    disconnect() {
        console.debug("[ionx-lazy-load] disconnect controller")

        this.observer.disconnect();
        this.observer = undefined;

        this.content.__ionxLazyLoad = undefined;
        this.content = undefined;
    }
}
