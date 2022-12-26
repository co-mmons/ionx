import type {Components as ionic} from "@ionic/core";
import {Svg} from "ionx/Svg";
import {isHydrated, waitTillHydrated} from "ionx/utils";
import {itemErrorCssClass, itemLoadedCssClass, itemLoadingCssClass, itemPendingCssClass} from "./cssClasses";
import {ExtendedContent} from "./ExtendedContent";
import {ExtendedItemElement} from "./ExtendedItemElement";
import {realContainerElement} from "./realContainerElement";
import {LazyLoadableCustomElement} from "./LazyLoadableCustomElement";
import {styleParents} from "./styleParents";

const srcSupportedTagNames = ["IMG", "VIDEO", "IFRAME", Svg.toUpperCase()];

export class LazyLoadController {

    constructor(content: HTMLElement & ionic.IonContent) {
        this.content = content;
        this.init();
    }

    private content: HTMLElement & ionic.IonContent & ExtendedContent;

    private intersectionObserver: IntersectionObserver;

    private mutationObserver: MutationObserver;

    private items: HTMLCollectionOf<Element>;

    private errors: HTMLCollectionOf<Element>;

    private containers: {
        element: HTMLIonxLazyLoadElement,
        items: HTMLCollectionOf<Element>,
        errors: HTMLCollectionOf<Element>,
        shadowItems: () => NodeListOf<Element>,
        shadowErrors: () => NodeListOf<Element>}[] = [];

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

        const loadEventName = element.tagName === "VIDEO" ? "loadedmetadata" : "load";

        delete element.__lazyLoadSrc;

        element.classList.remove(itemPendingCssClass);
        element.classList.add(itemLoadingCssClass);

        styleParents(element, options?.styleParents);

        const load = async (afterError: boolean) => {

            if (element.lazyLoad) {

                if (!afterError) {
                    await element.lazyLoad(options);
                } else {
                    markAsError();
                }

            } else if (options?.src) {

                const srcs = Array.isArray(options.src) ? options.src : [options.src];

                if (srcs.length === 0) {
                    console.warn("[ionx-lazy-load] element cannot be lazy loaded, no src given", element);
                    markAsError();

                } else {

                    const lastSrc = (srcSupported && element.getAttribute("src")) || element.__lazyLoadSrc || null;
                    const lastSrcIndex = srcs.lastIndexOf(lastSrc);

                    if (lastSrcIndex >= srcs.length - 1) {
                        markAsError();

                    } else {
                        let src = srcs[lastSrcIndex + 1];
                        if (typeof src === "function") {
                            try {
                                srcs[lastSrcIndex + 1] = src = await src();
                            } catch (e) {
                                srcs.splice(lastSrcIndex + 1, 1);
                                onItemError({target: element, error: e})
                                return;
                            }
                        }

                        if (srcSupported) {
                            element.setAttribute("src", src);

                        } else {
                            const img = new Image();
                            img.addEventListener("error", onItemError);
                            img.addEventListener("load", onItemLoad);
                            element.__lazyLoadSrc = img.src = src;
                        }
                    }
                }
            }
        }

        const markAsError = () => {

            element.classList.add(itemErrorCssClass);
            element.classList.remove(itemLoadedCssClass, itemPendingCssClass, itemLoadingCssClass);
            styleParents(element, options?.styleParents);

            element.removeEventListener(loadEventName, onItemLoad);
            element.removeEventListener("error", onItemError);

            this.intersectionObserver.unobserve(element);
        }

        const onItemError = (ev: Event | {target: Element, error: any}) => {
            console.debug(ev);

            const target = ev.target as Element;

            if (target !== element) {
                target.removeEventListener(loadEventName, onItemLoad);
                target.removeEventListener("error", onItemError);
            }

            load(true);
        }

        const onItemLoad = (_ev: Event) => {

            const target = _ev.target as Element;

            element.classList.add(itemLoadedCssClass);
            element.classList.remove(itemPendingCssClass, itemLoadingCssClass, itemErrorCssClass);
            styleParents(element, options?.styleParents);

            this.intersectionObserver.unobserve(element);

            target.removeEventListener(loadEventName, onItemLoad);
            target.removeEventListener("error", onItemError);
            element.removeEventListener(loadEventName, onItemLoad);
            element.removeEventListener("error", onItemError);

            if (target !== element) {
                (element as HTMLElement).style.backgroundImage = `url(${target.getAttribute("src")})`;
            }
        }

        if (srcSupported || element.lazyLoad) {
            element.addEventListener("error", onItemError);
            element.addEventListener(loadEventName, onItemLoad);
        }

        load(false);
    }

    connectContainer(containerElement: HTMLIonxLazyLoadElement) {

        if (!this.containers.find(c => c.element === containerElement)) {
            const element = realContainerElement(containerElement);
            this.containers.push({
                element: containerElement,
                items: element?.getElementsByClassName("ionx-lazy-load-pending"),
                errors: element?.getElementsByClassName(itemErrorCssClass),
                shadowItems: () => containerElement.observeShadow && element.shadowRoot.querySelectorAll(`.${itemPendingCssClass}`),
                shadowErrors: () => containerElement.observeShadow && element.shadowRoot.querySelectorAll(`.${itemErrorCssClass}`)
            });
        }

        this.ensureLoaded();
    }

    disconnectContainer(container: HTMLIonxLazyLoadElement) {

        const idx = this.containers.findIndex(c => c.element === container);
        if (idx > -1) {
            this.containers.splice(idx, 1);
        }

        if (this.containers.length === 0) {
            this.disconnect();
        }
    }

    async ensureLoaded(options?: {retryError?: boolean}) {

        if (options?.retryError) {
            for (const errors of [this.errors, ...this.containers.map(c => c.errors), ...this.containers.map(c => c.shadowErrors())]) {
                if (errors) {
                    for (let i = 0; i < errors.length; i++) {
                        const item = errors[i];
                        item.classList.add(itemPendingCssClass);
                        item.classList.remove(itemErrorCssClass);
                    }
                }
            }
        }

        for (const items of [this.items, ...this.containers.map(c => c.items), ...this.containers.map(c => c.shadowItems())]) {
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    this.intersectionObserver.observe(items[i]);
                }
            }
        }

        if (!isHydrated(this.content)) {
            waitTillHydrated(this.content, {interval: 100, timeout: 10000}).then(() => this.ensureLoaded());
        }
    }

    private init() {

        this.intersectionObserver = new IntersectionObserver(entries => this.callback(entries), {
            root: this.content,
            threshold: 0,
        });

        this.mutationObserver = new MutationObserver(records => records.find(record => record.addedNodes) && this.ensureLoaded());
        this.mutationObserver.observe(this.content, {subtree: true, childList: true});

        this.items = this.content.getElementsByClassName(itemPendingCssClass);
        this.errors = this.content.getElementsByClassName(itemErrorCssClass);
    }

    disconnect() {
        console.debug("[ionx-lazy-load] disconnect controller")

        this.intersectionObserver.disconnect();
        this.intersectionObserver = undefined;

        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;

        this.content.__ionxLazyLoad = undefined;
        this.content = undefined;
    }
}
