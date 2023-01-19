import type {Components as ionic} from "@ionic/core";
import {Svg} from "ionx/Svg";
import {addEventListener, EventUnlisten, isHydrated, waitTillHydrated} from "ionx/utils";
import {itemErrorCssClass, itemLoadedCssClass, itemLoadingCssClass, itemPendingCssClass} from "./cssClasses";
import {ExtendedContent} from "./ExtendedContent";
import {ExtendedItemElement} from "./ExtendedItemElement";
import {LazyLoadableCustomElement} from "./LazyLoadableCustomElement";
import {realContainerElement} from "./realContainerElement";
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

    resumeUnlisten: EventUnlisten;

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

                type UrlProvider = (() => Promise<string>) | (() => Promise<Blob>) | Blob;
                type ProcessedUrlProvider = [provider: UrlProvider, url: string];
                const srcs: Array<string | (() => Promise<string>) | (() => Promise<Blob>) | Blob | ProcessedUrlProvider> = Array.isArray(options.src) ? options.src : [options.src];

                if (srcs.length === 0) {
                    console.warn("[ionx-lazy-load] element cannot be lazy loaded, no src given", element);
                    markAsError();

                } else {

                    const lastSrc = (srcSupported && element.getAttribute("src")) || element.__lazyLoadSrc || null;
                    const lastSrcIndex = srcs.findIndex(s => Array.isArray(s) ? s[1] === lastSrc : s === lastSrc);

                    if (lastSrcIndex >= srcs.length - 1) {
                        markAsError();

                    } else {
                        const srcIndex = lastSrcIndex + 1;
                        let src: any = srcs[lastSrcIndex + 1];
                        const provider: UrlProvider = Array.isArray(src) ? src[0] : (src instanceof Blob || typeof src === "function" ? src : undefined);

                        // najpewniej ponowna próba ładowania już wcześniej ładowanego url'a, który nie był stringiem
                        if (Array.isArray(src)) {
                            src = provider;
                        }

                        if (typeof src === "function") {
                            try {
                                src = await src();
                            } catch (e) {
                                console.debug("[ionx-lazy-load] item provider error", e);
                                src = `#lazy-error-${srcIndex}-${Date.now()}`;
                            }
                        }

                        if (src instanceof Blob) {
                            src = URL.createObjectURL(src) + "#lazy-revoke";
                        }

                        if (provider) {
                            srcs[srcIndex] = [provider, src];
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

            const src = target !== element ? target.getAttribute("src") : element.getAttribute("src");
            if (src && src.startsWith("blob:") && src.endsWith("#lazy-revoke")) {
                setTimeout(() => URL.revokeObjectURL(src.replace("#lazy-revoke", "")), 5000);
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

            const src = target !== element ? target.getAttribute("src") : element.getAttribute("src");
            if (src && src.startsWith("blob:") && src.endsWith("#lazy-revoke")) {
                setTimeout(() => URL.revokeObjectURL(src.replace("#lazy-revoke", "")), 5000);
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
        console.debug("[ionx-lazy-load] ensure loaded")

        if (options?.retryError) {
            for (const errors of [this.errors, ...this.containers.map(c => c.errors), ...this.containers.map(c => c.shadowErrors())]) {
                if (errors) {
                    for (let i = 0; i < errors.length; i++) {
                        const item = errors[i];
                        console.debug("[ionx-lazy-load] retry item after error", item)

                        item.classList.add(itemPendingCssClass);
                        item.classList.remove(itemErrorCssClass);
                        styleParents(item, (item as ExtendedItemElement).__lazyLoadOptions?.styleParents);

                        if (srcSupportedTagNames.includes(item.tagName)) {
                            item.removeAttribute("src");
                        } else {
                            item["__lazyLoadSrc"] = undefined;
                        }
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

        this.resumeUnlisten = addEventListener(document, "resume", () => this.ensureLoaded({retryError: true}));
    }

    disconnect() {
        console.debug("[ionx-lazy-load] disconnect controller")

        this.intersectionObserver.disconnect();
        this.intersectionObserver = undefined;

        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;

        this.content.__ionxLazyLoad = undefined;
        this.content = undefined;

        this.resumeUnlisten?.();
    }
}
