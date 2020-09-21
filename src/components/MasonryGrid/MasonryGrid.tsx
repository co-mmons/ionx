import {Capacitor} from "@capacitor/core";
import {sleep, waitTill} from "@co.mmons/js-utils/core";
import {Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Listen} from "@stencil/core";
import {Subscription} from "rxjs";
import {ExtendedItemElement} from "./ExtendedItemElement";

@Component({
    tag: "ionx-masonry-grid",
    styleUrl: "MasonryGrid.scss",
    scoped: true
})
export class MasonryGrid implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Event()
    didFirstLayout: EventEmitter<void>;

    didFirstRender$ = false;

    @Event()
    didLayout: EventEmitter<void>;

    laying: boolean;

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

    pauseSubscription: Subscription;

    resumeSubscription: Subscription;

    viewDidEnterUnlisten: Function;

    get parentViewActive() {
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

    async doLayout(force: boolean = false) {

        try {
            await waitTill(() => !this.laying, 10, 5000);
        } catch {
            return;
        }

        this.laying = true;

        try {

            // czy są itemy, które trzeba ułożyć
            let doLayout: boolean = false;

            // wszystkie itemy gridu
            const items = this.items();

            // sprawdzamy item pod kątem zmienionych itemów, usuniętych lub przesuniętych
            for (let i = 0; i < items.length; i++) {

                const item = items[i];

                //
                // if (!item.hidden) {
                //     items.push(item);
                // }

                // zmieniła się pozycja itemu albo wymuszony rendering
                if (item.__ionxMasonryCache?.index !== i || force) {
                    item.__ionxMasonryLaid = false;
                }

                // jeżeli poprzedni item wymaga renderu, to jego sąsiad również
                if (i > 0 && !items[i - 1].__ionxMasonryLaid) {
                    item.__ionxMasonryLaid = false;
                }

                if (!item.__ionxMasonryLaid || force) {
                    doLayout = true;
                }
            }

            // najpewniej usunięte zostały itemy na końcu gridu
            if (items.length !== this.lastItemsCount) {
                doLayout = true;
            }

            // console.log("rebuild check", container.getBoundingClientRect().width, this.lastWidth, items.length, this.lastItemsCount);
            // console.log("rebuild check",  items.length, this.lastItemsCount, doRender);

            // kolejkujemy renderowania jeżeli strona nie jest widoczna lub aplikacja w pauzie
            QUEUE: if (!this.parentViewActive || this.paused) {
                this.queuedLayout = doLayout || this.element.getBoundingClientRect().width !== this.lastWidth;

                // poczekajmy na skończenie animacji zmiany strony
                // tak na wszelki wypadek, aby mieć pewność, że
                // strona jest jednak aktywna, mimo, że stan na to nie wskazuje
                if (!this.paused) {
                    for (let i = 0; i < 40; i++) {
                        await sleep(50);
                        if (this.parentViewActive) {
                            break QUEUE;
                        }
                    }
                }

                this.laying = false;

                return;
            }

            this.queuedLayout = false;

            // podczas przekręcania urządzenia iOS mamy opóźnienie w uzyskaniu nowego rozmiaru okna
            // todo zweryfikować jak to działa
            if (Capacitor.platform === "ios" && items.length > 0 && !doLayout && force && this.element.getBoundingClientRect().width === this.lastWidth) {
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
                    item.__ionxMasonryLaid = false;
                }
            }

            // ok, możemy przystąpić do renderowania
            RENDER: if (doLayout) {
                // console.log("rebuild grid", container.getBoundingClientRect().width, this.lastWidth, window.innerWidth);

                // dajmy czas złapać oddech Angularowi ;-)
                // a tak na serio chodzi o problem z ExpressionChangedAfterItHasBeenCheckedError
                await sleep(10);

                // upewniamy się, że możemy renderować - kontener musi mieć jakąś szerokość
                if (this.element.getBoundingClientRect().width === 0) {
                    try {
                        await waitTill(() => this.element.getBoundingClientRect().width > 0, undefined, 5000);
                    } catch {
                        break RENDER;
                    }
                }

                // resetujemy brudne itemy - ustawiamy pozycję na 0x0
                for (const item of items) {
                    if (!item.__ionxMasonryLaid) {
                        item.style.top = "0px";
                        item.style.left = "0px";
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

                const itemsPositions: { [index: number]: { left: number, top: number } } = {};

                const gridRect = this.element.getBoundingClientRect();

                for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

                    const item = items[itemIndex];

                    if (!item.__ionxMasonryCache) {
                        item.__ionxMasonryCache = {};
                    }

                    item.__ionxMasonryCache.index = itemIndex;

                    // czekamy na hydrację
                    while (item.querySelectorAll(":scope[hydratable]:not(.hydrated), :scope.hydratable:not(.hydrated), [hydratable]:not(.hydrated), .hydratable:not(.hydrated)").length > 0) {
                        await sleep(10);
                    }

                    if (!item.__ionxMasonryLaid || !item.__ionxMasonryCache.rect) {
                        item.__ionxMasonryCache.rect = item.getBoundingClientRect();
                    }

                    const isNewSection = sectionItems.length === 0 || false /*item.newRow*/;

                    // element, pod którym mam być wstawiony ten element
                    // w przypadku nowej lini albo puste, albo element, który jest najbardziej wysunięty do dołu
                    let sibling: HTMLElement & ExtendedItemElement;

                    if (isNewSection) {
                        sibling = (sectionItems.length && sectionItems[0]) || (itemIndex > 0 && items[itemIndex - 1]);
                        sectionItems = [];
                        sectionCascade = false;

                    } else if (!sectionCascade) {

                        sibling = items[itemIndex - 1];

                        // console.log(sibling.__ionxMasonryCache.rect.left - gridRect.left, sibling.__ionxMasonryCache.rect.width, item.__ionxMasonryCache.rect.width, gridRect.width);
                        console.log((sibling.__ionxMasonryCache.rect.left - gridRect.left + sibling.__ionxMasonryCache.rect.width + item.__ionxMasonryCache.rect.width), gridRect.width);

                        // nie ma już miejsca w pierwszej lini sekcji, trzeba zawijać i szukać itemu, pod którym jest miejsce
                        if (~~(sibling.__ionxMasonryCache.rect.left - gridRect.left + sibling.__ionxMasonryCache.rect.width + item.__ionxMasonryCache.rect.width) > gridRect.width) {
                            sibling = sectionItems.pop();
                            sectionCascade = true;
                        }

                    } else {
                        sibling = sectionItems.pop();
                    }

                    let itemLeft: number;
                    let itemTop: number;

                    if (!item.__ionxMasonryLaid) {
                        itemLeft = isNewSection ? 0 : (itemsPositions[sibling.__ionxMasonryCache.index].left + (!sectionCascade ? sibling.__ionxMasonryCache.rect.width : 0));
                        itemTop = !sibling ? 0 : (itemsPositions[sibling.__ionxMasonryCache.index].top + (sectionCascade || isNewSection ? sibling.__ionxMasonryCache.rect.height : 0));

                        item.style.left = `${itemLeft}px`;
                        item.style.top = `${itemTop}px`;

                        item.__ionxMasonryLaid = true;

                        item.__ionxMasonryCache.left = itemLeft;
                        item.__ionxMasonryCache.top = itemTop;
                        item.__ionxMasonryCache.rect = item.getBoundingClientRect();

                    } else {
                        itemLeft = item.__ionxMasonryCache.left;
                        itemTop = item.__ionxMasonryCache.top;
                    }

                    itemsPositions[item.__ionxMasonryCache.index] = {left: itemLeft, top: itemTop};

                    if (!isNewSection || true /* !item.newRow */) {
                        sectionItems.push(item);
                        sectionItems.sort(sortSectionItems);
                    }

                    // console.log(item, itemLeft, itemTop);

                    // console.log(itemTop, siblingRect?.height);

                    // if (sibling && itemLeft === itemsPositions[sibling["index"]].left && itemsPositions[sibling["index"]].top + siblingRect.height > itemTop) {
                    // console.log("error", item.element.innerText, itemTop, "sibling", sibling.element.innerText, itemsPositions[sibling["index"]].top, siblingRect.top, siblingRect.height);
                    // }
                }

                let lowestItem = (sectionItems.length && sectionItems[0]) || (items.length && items[items.length - 1]);
                if (lowestItem) {
                    let rect = lowestItem.getBoundingClientRect();
                    this.element.style.height = `${rect.top - gridRect.top + rect.height}px`;
                } else {
                    this.element.style.height = "0px";
                }

                this.lastWidth = gridRect.width;
                this.lastItemsCount = items.length;

                // this.didRender.emit();
                //
                // if (!this.didFirstRender.isStopped) {
                //     this.didFirstRender.emit();
                //     this.didFirstRender.complete();
                // }

                // if (this.lazyLoad) {
                //     this.lazyLoad.revalidate();
                // }

                if (Capacitor.platform === "ios") {
                    let scroll: HTMLElement = await this.content.getScrollElement();
                    scroll.style.overflowY = "hidden";
                    await sleep(200);
                    scroll.style.overflowY = "auto";
                }
            }

        } finally {
            this.laying = false;

            if (!this.parentViewActive || this.paused) {
                this.render();
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

        // if (this.cascade) {
            this.doLayout(true);
        // }
    }

    onMutation(mutations: MutationRecord[]) {

        for (const mutation of mutations) {

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i] instanceof HTMLElement) {
                    this.doLayout();
                    break;
                }
            }

            for (let i = 0; i < mutation.removedNodes.length; i++) {
                if (mutation.removedNodes[i] instanceof HTMLElement) {
                    this.doLayout();
                    break;
                }
            }
        }

    }

    connectedCallback() {

        this.content = this.element.closest("ion-content");
        this.parentView = this.element.closest("ion-page");

        this.observer = new MutationObserver(mutations => this.onMutation(mutations));
        this.observer.observe(this.element, {childList: true});
    }

    disconnectedCallback() {
        this.observer.disconnect();
        this.observer = undefined;
    }

    render() {
        return <Host>
            <slot/>
        </Host>;
    }

}