import {Capacitor} from "@capacitor/core";
import {sleep, waitTill} from "@co.mmons/js-utils/core";
import {Component, ComponentInterface, Element, h, Host, Listen, Method, Prop} from "@stencil/core";
import {addEventListener, EventUnlisten, isHydrated, markAsReady, markAsUnready} from "../misc";
import {ExtendedItemElement} from "./ExtendedItemElement";
import {lineBreakAttribute} from "./lineBreak";

@Component({
    tag: "ionx-multi-grid",
    styleUrl: "MultiGrid.scss",
    scoped: true
})
export class MultiGrid implements ComponentInterface {

    @Element()
    element: HTMLElement;

    /**
     * If grid should behave as block element, where all its children
     * are layed row by row in single column.
     */
    @Prop({reflect: true})
    layout: "masonry" | "block";

    busy: boolean;

    /**
     * If at least one layout call is waiting.
     */
    waiting: boolean;

    observer: MutationObserver;

    /**
     * Ostatnia ilość itemów w gridzie (żeby wiedzieć, czy trzeba przebudować).
     */
    lastItemsCount: number;

    /**
     * Ostatnia szerokość gridu (żeby wiedzieć, czy trzeba przebudować).
     */
    lastWidth: number;

    /**
     * Czy przebudowa gridu została zlecona gdy widok był niewidoczny albo pauzowany.
     */
    queuedLayout: boolean;

    content: HTMLIonContentElement;

    parentView: HTMLElement;

    paused: boolean = false;

    pauseUnlisten: EventUnlisten;

    resumeUnlisten: EventUnlisten;

    viewDidEnterUnlisten: EventUnlisten;

    isParentViewActive() {
        return !this.parentView?.classList.contains("ion-page-hidden");
    }

    items() {
        const items: Array<HTMLElement & ExtendedItemElement> = [];

        const children = this.element.children;
        for (let i = 0; i < children.length; i++) {
            items.push(children[i] as HTMLElement);
        }

        return items;
    }

    @Method()
    async markItemAsDirty(item: HTMLElement) {
        const extended: HTMLElement & ExtendedItemElement = item;
        extended.__ionxMultiGridReady = false;
        this.arrange({force: true});
    }

    @Method()
    async arrange(options?: {force?: boolean, trigger?: "onresize"}) {

        while (this.busy) {

            if (this.waiting) {
                return;
            }

            this.waiting = true;

            await sleep(10);
        }

        this.waiting = false;
        this.busy = true;

        if (this.layout === "block") {

            const items = this.items();

            // czekamy na hydrację
            for (let i = 0; i < items.length; i++) {
                while (!isHydrated(items[i])) {
                    await sleep(10);
                }
            }

            markAsReady(this);

            this.busy = false;

            return;
        }

        try {

            // czy są itemy, które trzeba ułożyć
            let doLayout: boolean = false;

            // wszystkie itemy gridu
            const items = this.items();
            // console.error("[ionx-multi-grid] checking items")

            // sprawdzamy item pod kątem zmienionych itemów, usuniętych lub przesuniętych
            for (let i = 0; i < items.length; i++) {

                const item = items[i];

                //
                // if (!item.hidden) {
                //     items.push(item);
                // }

                // zmieniła się pozycja itemu albo wymuszony rendering
                if (item.__ionxMultiGridCache?.index !== i || options?.force) {
                    item.__ionxMultiGridReady = false;
                }

                // jeżeli poprzedni item wymaga renderu, to jego sąsiad również
                if (i > 0 && !items[i - 1].__ionxMultiGridReady) {
                    item.__ionxMultiGridReady = false;
                }

                const rect = item.getBoundingClientRect();
                if (item.__ionxMultiGridCache?.rect?.width !== rect.width || item.__ionxMultiGridCache?.rect?.height !== rect.height) {
                    item.__ionxMultiGridReady = false;

                    if (!item.__ionxMultiGridCache) {
                        item.__ionxMultiGridCache = {rect};
                    }
                }

                if (!item.__ionxMultiGridReady || options?.force) {
                    doLayout = true;
                }

                if (!item.__ionxMultiGridReady) {
                    item.style.display = "none";
                }
            }

            // najpewniej usunięte zostały itemy na końcu gridu
            if (items.length !== this.lastItemsCount) {
                doLayout = true;
            }

            // console.log("rebuild check", container.getBoundingClientRect().width, this.lastWidth, items.length, this.lastItemsCount);
            // console.log("rebuild check",  items.length, this.lastItemsCount, doRender);

            // kolejkujemy renderowania jeżeli strona nie jest widoczna lub aplikacja w pauzie
            QUEUE: if (!this.isParentViewActive() || this.paused) {
                this.queuedLayout = doLayout || this.element.getBoundingClientRect().width !== this.lastWidth;

                // poczekajmy na skończenie animacji zmiany strony
                // tak na wszelki wypadek, aby mieć pewność, że
                // strona jest jednak aktywna, mimo, że stan na to nie wskazuje
                if (!this.paused) {
                    for (let i = 0; i < 40; i++) {
                        await sleep(50);
                        if (this.isParentViewActive()) {
                            break QUEUE;
                        }
                    }
                }

                this.busy = false;

                return;
            }

            this.queuedLayout = false;

            // podczas przekręcania urządzenia iOS mamy opóźnienie w uzyskaniu nowego rozmiaru okna
            // todo zweryfikować jak to działa
            if (Capacitor.platform === "ios" && items.length > 0 && !doLayout && options?.force && this.element.getBoundingClientRect().width === this.lastWidth) {
                for (let i = 0; i < 40; i++) {
                    await sleep(50);
                    if (this.element.getBoundingClientRect().width !== this.lastWidth) {
                        break;
                    }
                }
            }

            // zmienił się rozmiar kontenera, oznaczamy wszystkie itemy do renderu
            if (this.element.getBoundingClientRect().width !== this.lastWidth) {
                doLayout = true;
                for (const item of items) {
                    item.__ionxMultiGridReady = false;
                }
            }

            // ok, możemy przystąpić do renderowania
            LAYOUT: if (doLayout) {
                // console.log("rebuild grid", this.element.getBoundingClientRect().width, this.lastWidth, window.innerWidth);

                // upewniamy się, że możemy renderować - kontener musi mieć jakąś szerokość
                if (this.element.getBoundingClientRect().width === 0) {
                    try {
                        await waitTill(() => this.element.getBoundingClientRect().width > 0, undefined, 5000);
                    } catch {
                        break LAYOUT;
                    }
                }

                // resetujemy brudne itemy - ustawiamy pozycję na 0x0
                for (const item of items) {
                    if (!item.__ionxMultiGridReady) {
                        item.style.top = "-100%";
                        item.style.left = "-100%";
                        item.style.display = "block";
                        item.style.visibility = "hidden";
                    }
                }

                const sortSectionItems = (a: HTMLElement, b: HTMLElement) => {
                    const ar = a.getBoundingClientRect();
                    const br = b.getBoundingClientRect();

                    if (ar.bottom === br.bottom) {
                        return br.left - ar.left;
                    } else {
                        return br.bottom - ar.bottom;
                    }
                };

                // itemy aktualnie przetwarzanej sekcji
                // po każdym dodaniu, należy posortować
                let sectionItems: (HTMLElement & ExtendedItemElement)[] = [];

                // czy w ramach sekcji itemy są już zawijane, czyli dodawane nie w pierwszej lini
                // a wg wysokości itemów
                let sectionCascade = false;

                const itemsPositions: {[index: number]: {left: number, top: number}} = {};

                let gridRect = this.element.getBoundingClientRect();

                for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

                    const item = items[itemIndex];
                    const previous = itemIndex > 0 ? items[itemIndex - 1] : undefined;

                    if (!item.__ionxMultiGridCache) {
                        item.__ionxMultiGridCache = {};
                    }

                    item.__ionxMultiGridCache.index = itemIndex;

                    // czekamy na hydrację
                    while (!isHydrated(item)) {
                        await sleep(10);
                    }

                    if (!item.__ionxMultiGridReady || !item.__ionxMultiGridCache.rect) {
                        item.__ionxMultiGridCache.rect = item.getBoundingClientRect();
                    }

                    const breakLine = item.getAttribute(lineBreakAttribute) === "before" || item.classList.contains(lineBreakAttribute) || (previous?.getAttribute(lineBreakAttribute) === "after") || gridRect.width === item.__ionxMultiGridCache.rect.width;
                    const isNewSection = sectionItems.length === 0 || breakLine;

                    // element, pod którym mam być wstawiony ten element
                    // w przypadku nowej lini albo puste, albo element, który jest najbardziej wysunięty do dołu
                    let sibling: HTMLElement & ExtendedItemElement;

                    if (isNewSection) {
                        sibling = (sectionItems.length && sectionItems[0]) || (itemIndex > 0 && items[itemIndex - 1]);
                        sectionItems = [];
                        sectionCascade = false;

                    } else if (!sectionCascade) {

                        sibling = previous;

                        // console.log(sibling.__ionxMasonryCache.rect.left - gridRect.left, sibling.__ionxMasonryCache.rect.width, item.__ionxMasonryCache.rect.width, gridRect.width);
                        // console.log((sibling.__ionxMasonryCache.rect.left - gridRect.left + sibling.__ionxMasonryCache.rect.width + item.__ionxMasonryCache.rect.width), gridRect.width);
                        // console.log(sibling.__ionxMasonryCache.rect.left, gridRect.left, sibling.__ionxMasonryCache.rect.width, item.__ionxMasonryCache.rect.width, gridRect.width);

                        // nie ma już miejsca w pierwszej lini sekcji, trzeba zawijać i szukać itemu, pod którym jest miejsce
                        if (~~(sibling.__ionxMultiGridCache.rect.left - gridRect.left + sibling.__ionxMultiGridCache.rect.width + item.__ionxMultiGridCache.rect.width) > gridRect.width) {
                            sectionCascade = true;
                            sibling = undefined;
                            // console.log("newline item", item);
                            // console.log("newline sibling", sibling);
                            // console.log("---");
                        }
                    }

                    if (sectionCascade) {
                        sibling = sectionItems.pop();
                    }

                    let itemLeft: number;
                    let itemTop: number;

                    if (!item.__ionxMultiGridReady) {
                        // console.log("item", item);
                        // console.log("sibling", sibling);
                        // console.log("---", itemIndex);

                        itemLeft = isNewSection ? 0 : (itemsPositions[sibling.__ionxMultiGridCache.index].left + (!sectionCascade ? sibling.__ionxMultiGridCache.rect.width : 0));
                        itemTop = !sibling ? 0 : (itemsPositions[sibling.__ionxMultiGridCache.index].top + (sectionCascade || isNewSection ? sibling.__ionxMultiGridCache.rect.height : 0));

                        item.style.left = `${itemLeft}px`;
                        item.style.top = `${itemTop}px`;

                        // console.log(itemLeft, sibling, sibling && itemsPositions[sibling.__ionxMasonryCache.index].left);

                        item.__ionxMultiGridReady = true;

                        item.__ionxMultiGridCache.left = itemLeft;
                        item.__ionxMultiGridCache.top = itemTop;
                        item.__ionxMultiGridCache.rect = item.getBoundingClientRect();

                    } else {
                        itemLeft = item.__ionxMultiGridCache.left;
                        itemTop = item.__ionxMultiGridCache.top;
                    }

                    itemsPositions[item.__ionxMultiGridCache.index] = {left: itemLeft, top: itemTop};
                    item.style.visibility = "visible";

                    if (!isNewSection || !breakLine) {
                        sectionItems.push(item);
                        sectionItems.sort(sortSectionItems);
                    }

                    // console.log(item, itemLeft, itemTop);
                    // console.log(itemTop, siblingRect?.height);
                    // if (sibling && itemLeft === itemsPositions[sibling["index"]].left && itemsPositions[sibling["index"]].top + siblingRect.height > itemTop) {
                    // console.log("error", item.element.innerText, itemTop, "sibling", sibling.element.innerText, itemsPositions[sibling["index"]].top, siblingRect.top, siblingRect.height);
                    // }
                }

                gridRect = this.element.getBoundingClientRect();

                const lowestItem = (sectionItems.length && sectionItems[0]) || (items.length && items[items.length - 1]);
                if (lowestItem) {
                    const rect = lowestItem.getBoundingClientRect();
                    this.element.style.height = `${rect.top - gridRect.top + rect.height}px`;
                } else {
                    this.element.style.height = "0px";
                }

                this.lastWidth = gridRect.width;
                this.lastItemsCount = items.length;

                if (Capacitor.platform === "ios") {
                    const scroll: HTMLElement = await this.content.getScrollElement();
                    scroll.style.overflowY = "hidden";
                    await sleep(200);
                    scroll.style.overflowY = "auto";
                }
            }

        } finally {
            if (this.busy) {
                this.busy = false;

                markAsReady(this);

                if (!this.isParentViewActive() || this.paused) {
                    this.arrange();
                } else if (options?.trigger === "onresize") {
                    setTimeout(() => this.arrange());
                }
            }
        }


    }

    @Listen("beforeresize", {target: "window"})
    @Listen("resize", {target: "window"})
    protected async resized(event: CustomEvent) {

        if (Capacitor.platform === "ios") {

            if (event.type === "resize") {
                return;
            }

            let width = event.detail.width;

            try {
                await waitTill(() => window.innerWidth === width, undefined, 2000);
            } catch {
            }
        }

        this.arrange({force: true, trigger: "onresize"});
    }

    viewPaused() {
        this.paused = true;
    }

    viewResumed() {
        this.paused = false;

        if (this.queuedLayout) {
            this.arrange();
        }
    }

    viewDidEnter() {
        if (this.queuedLayout) {
            this.arrange();
        }
    }

    @Listen("visibilitychange", {target: "document"})
    visibilityChanged() {
        if (document.visibilityState == "hidden") {
            this.viewPaused();
        } else if (document.visibilityState == "visible") {
            this.viewResumed();
        }
    }

    onMutation(mutations: MutationRecord[]) {

        for (const mutation of mutations) {

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i] instanceof HTMLElement) {
                    this.arrange();
                    return;
                }
            }

            for (let i = 0; i < mutation.removedNodes.length; i++) {
                if (mutation.removedNodes[i] instanceof HTMLElement) {
                    this.arrange();
                    return;
                }
            }
        }

    }

    connectedCallback() {
        markAsUnready(this);

        this.init();
    }

    init() {

        this.content = this.element.closest("ion-content");
        this.parentView = this.element.closest(".ion-page");

        if (!this.content || !this.parentView) {
            setTimeout(() => this.init());
            return;
        }

        this.pauseUnlisten = addEventListener(document, "pause", () => this.viewPaused());
        this.resumeUnlisten = addEventListener(document, "resume", () => this.viewPaused());
        this.viewDidEnterUnlisten = addEventListener(this.parentView, "ionViewDidEnter", () => this.viewDidEnter())

        this.observer = new MutationObserver(mutations => this.onMutation(mutations));
        this.observer.observe(this.element, {childList: true});
    }

    disconnectedCallback() {
        this.observer.disconnect();
        this.observer = undefined;

        this.content = undefined;
        this.parentView = undefined;

        this.pauseUnlisten();
        this.pauseUnlisten = undefined;

        this.resumeUnlisten();
        this.resumeUnlisten = undefined;

        this.viewDidEnterUnlisten();
        this.viewDidEnterUnlisten = undefined;
    }

    render() {
        return <Host>
            <slot/>
        </Host>;
    }

}
