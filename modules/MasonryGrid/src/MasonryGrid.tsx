import {Capacitor} from "@capacitor/core";
import {sleep, waitTill} from "@co.mmons/js-utils/core";
import type {Components as ionic} from "@ionic/core";
import {Component, ComponentInterface, Element, h, Host, Listen, Method, Prop} from "@stencil/core";
import {addEventListener, EventUnlisten, isHydrated, markAsReady, markAsUnready} from "ionx/utils";
import {WidthBreakpointsContainer} from "ionx/WidthBreakpoints";
import {ExtendedItemElement} from "./ExtendedItemElement";
import {lineBreakAttribute} from "./lineBreak";

const gridCacheProp = "__ionxMasonryGridCache";
const gridReadyProp = "__ionxMasonryGridReady";

@Component({
    tag: "ionx-masonry-grid",
    styleUrl: "MasonryGrid.scss",
    scoped: true
})
export class MasonryGrid implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    innerStyle: any;

    busy: boolean;

    /**
     * If at least one layout call is waiting.
     */
    waiting: boolean;

    breakpoints: WidthBreakpointsContainer;

    mutationObserver: MutationObserver;

    resizeObserver: ResizeObserver;

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
    queuedArrange: boolean;

    contentElement: HTMLElement & ionic.IonContent;

    parentViewElement: HTMLElement;

    paused: boolean = false;

    pauseUnlisten: EventUnlisten;

    resumeUnlisten: EventUnlisten;

    viewDidEnterUnlisten: EventUnlisten;

    itemsElement: HTMLElement;

    isParentViewActive() {
        return !this.parentViewElement?.classList.contains("ion-page-hidden");
    }

    items() {
        const items: Array<HTMLElement & ExtendedItemElement> = [];

        const children = this.itemsElement?.children;
        if (children) {
            for (let i = 0; i < children.length; i++) {
                items.push(children[i] as HTMLElement);
            }
        }

        return items;
    }

    @Method()
    async markItemAsDirty(item: HTMLElement) {
        const extended: HTMLElement & ExtendedItemElement = item;
        extended[gridReadyProp] = false;
        this.arrange({force: true});
    }

    @Method()
    async arrange(options?: {force?: boolean, trigger?: "onresize"}) {

        let waiting = false;

        // we must wait until already started process finish its work
        while (this.busy) {

            // another process is waiting, so we can cancel this process
            if (!waiting && this.waiting) {
                console.debug("[ionx-masonry-grid] quit waiting")
                return;
            }

            this.waiting = waiting = true;

            await sleep(10);
        }

        // if arranging must be done because of changes in the content or sizes
        let doArrange: boolean = false;

        this.busy = true;
        this.waiting = undefined;

        try {

            this.queuedArrange = false;

            // kolejkujemy renderowania jeżeli strona nie jest widoczna lub aplikacja w pauzie
            QUEUE: if (!this.isParentViewActive() || this.paused) {

                // poczekajmy na skończenie animacji zmiany strony
                // tak na wszelki wypadek, aby mieć pewność, że
                // strona jest jednak aktywna, mimo, że stan na to nie wskazuje
                if (!this.paused) {
                    for (let i = 0; i < 10; i++) {
                        await sleep(100);
                        if (this.isParentViewActive()) {
                            break QUEUE;
                        }
                    }
                }

                console.debug("[ionx-masonry-grid] queue arrange new",
                    `new width: ${this.itemsElement.getBoundingClientRect().width}`, `old width: ${this.lastWidth}`,
                    `parent view active: ${this.isParentViewActive()}`, `paused: ${!!this.paused}`);

                this.queuedArrange = true;
                this.busy = false;

                return;
            }

            const items = this.items();

            // items container width is changed, all items must be repositioned
            if (this.itemsElement.getBoundingClientRect().width !== this.lastWidth) {
                console.debug("[ionx-masonry-grid] container width changed new:" + this.itemsElement.getBoundingClientRect().width + ", old:" + this.lastWidth);

                doArrange = true;

                for (const item of items) {
                    item[gridReadyProp] = false;
                    item[gridCacheProp] = undefined;
                    item.style.display = "none";
                }

            } else {

                // we must check which items must be repositioned
                for (let i = 0; i < items.length; i++) {

                    const item = items[i];

                    // zmieniła się pozycja itemu
                    if (item[gridCacheProp]?.index !== i) {
                        item[gridReadyProp] = false;
                        // console.debug("item index change")
                    }

                    // jeżeli poprzedni item wymaga renderu, to jego sąsiad również
                    if (i > 0 && !items[i - 1][gridReadyProp]) {
                        item[gridReadyProp] = false;
                    }

                    const rect = item.getBoundingClientRect();
                    if (item[gridCacheProp]?.width !== rect.width || item[gridCacheProp]?.height !== rect.height) {
                        item[gridReadyProp] = false;
                        // console.debug("width or height change")
                    }

                    if (!item[gridReadyProp]) {
                        item[gridCacheProp] = {width: rect.width, height: rect.height};
                        doArrange = true;
                        item.style.display = "none";
                    }
                }

                // najpewniej usunięte zostały itemy na końcu gridu
                if (items.length !== this.lastItemsCount) {
                    doArrange = true;
                    // console.debug("items count change")
                }

            }

            // ok, możemy przystąpić do renderowania
            ARRANGE: if (doArrange) {
                console.debug("[ionx-masonry-grid] arrange started")

                // upewniamy się, że możemy renderować - kontener musi mieć jakąś szerokość
                if (this.itemsElement.getBoundingClientRect().width === 0) {
                    try {
                        await waitTill(() => this.itemsElement.getBoundingClientRect().width > 0, undefined, 5000);
                    } catch {
                        console.debug("[ionx-masonry-grid] unable to arrange, container has not width");
                        break ARRANGE;
                    }
                }

                // resetujemy brudne itemy - ustawiamy pozycję na 0x0
                for (const item of items) {
                    if (!item[gridReadyProp]) {
                        item.style.top = "-100%";
                        item.style.left = "-100%";
                        item.style.display = "block";
                        item.style.visibility = "hidden";
                    }
                }

                const gridRect = this.itemsElement.getBoundingClientRect();
                const gridWidth = gridRect.width;
                let gridHeight = 0;

                const gridLines: [realLineIndex: number, ...linePixels: number[]][] = [[0, gridWidth]];

                function itemFitsLine(line: number[], itemStart: number, itemLength: number) {

                    let areaStart = 0;
                    for (let i = 1, area = line[i]; i < line.length; i++, area = line[i]) {
                        if (area < 0) {
                            areaStart += Math.abs(area);
                        } else if (area >= itemLength && areaStart <= itemStart && areaStart + area >= itemStart + itemLength) {
                            return areaStart + area <= gridWidth;
                        } else {
                            areaStart += area;
                        }
                    }

                    return false;
                }

                function addItemToLines(startLineIndex: number, itemStart: number, itemWidth: number, itemHeight: number) {

                    let lastLine: number[];
                    let lastLineIndex: number;

                    LINES: for (let nextIndex = startLineIndex, nextLine = gridLines[nextIndex]; nextIndex < startLineIndex + itemHeight; nextIndex++, nextLine = gridLines[nextIndex]) {

                        if (gridLines.length <= nextIndex) {
                            const prev = gridLines.length > 0 ? gridLines[nextIndex - 1] : undefined;
                            gridLines.push([prev ? prev[0] + 1 : 0, gridWidth]);
                            nextLine = gridLines[nextIndex];
                        }

                        lastLine = nextLine;
                        lastLineIndex = nextIndex;

                        let areaStart = 0;

                        for (let i = 1, area = nextLine[i]; i < nextLine.length; i++, area = nextLine[i]) {
                            if (area < 0) {
                                areaStart += Math.abs(area);

                            } else if (area >= itemWidth && areaStart <= itemStart && areaStart + area >= itemStart + itemWidth) {

                                const newAreas = [];

                                if (itemStart > areaStart) {
                                    newAreas.push(itemStart - areaStart);
                                }

                                newAreas.push(-itemWidth);

                                if (areaStart + area > itemStart + itemWidth) {
                                    newAreas.push((areaStart + area) - (itemStart + itemWidth));
                                }

                                nextLine.splice(i, 1, ...newAreas);
                                break;

                            } else {
                                areaStart += area;
                            }
                        }
                    }

                    return {lastLine, lastLineIndex};
                }

                function addItemToMatrix(itemWidth: number, itemHeight: number) {

                    let itemLeft: number;
                    let itemTop: number;
                    let lastLineIndex: number;

                    for (let lineIndex = 0, line = gridLines[lineIndex]; lineIndex < gridLines.length; lineIndex++, line = gridLines[lineIndex]) {

                        let itemStart = -1;
                        let areaStart = 0;

                        AREAS: for (let i = 1, area = line[i]; i < line.length; i++, area = line[i]) {

                            if (area < 0) {
                                areaStart += Math.abs(area);

                            } else if (area >= itemWidth && itemFitsLine(line, areaStart, itemWidth)) {

                                if (gridLines.length < lineIndex + 1) {
                                    // mamy to! możemy wstawić tutaj item, bo kolejne linie są puste
                                    itemStart = areaStart;
                                    break AREAS;

                                } else {
                                    // sprawdzamy każdą linię poniżej, czy możemy wstawić do niej item
                                    NEXT_LINES: for (let nextIndex = lineIndex + 1, nextLine = gridLines[nextIndex]; nextIndex < lineIndex + itemHeight; nextIndex++, nextLine = gridLines[nextIndex]) {

                                        if (gridLines.length <= nextIndex) {
                                            // nie ma więcej linii
                                            break NEXT_LINES;
                                        }

                                        if (!itemFitsLine(nextLine, areaStart, itemWidth)) {
                                            // niestety w następnej lini nie wstawimy, przechodzimy do kolejnego obszaru
                                            areaStart += area;
                                            continue AREAS;
                                        }
                                    }

                                    // skoro tu dotarliśmy, to znaczy, że w kolejnych liniach możemy wstawić item
                                    itemStart = areaStart;
                                    break AREAS;
                                }

                            } else {
                                areaStart += area;
                            }
                        }

                        if (itemStart > -1) {
                            const r = addItemToLines(lineIndex, itemStart, itemWidth, itemHeight);
                            itemLeft = itemStart;
                            itemTop = line[0];
                            lastLineIndex = r.lastLineIndex;
                            break;
                        }
                    }

                    if (itemLeft === undefined) {

                        // nie możemy dodać linii już istniejących, trzeba dodać nową linię
                        const prev = gridLines.length > 0 ? gridLines[gridLines.length - 1] : undefined;
                        const realLineIndex = prev ? prev[0] + 1 : 0;
                        gridLines.push([realLineIndex, gridWidth]);

                        const r = addItemToLines(gridLines.length - 1, 0, itemWidth, itemHeight);
                        lastLineIndex = r.lastLineIndex;
                        itemLeft = 0;
                        itemTop = realLineIndex;
                    }

                    for (let i = lastLineIndex; i >= 0; i--) {
                        if (gridLines[i].reduce((a, b) => a + (b > 0 ? 0 : b), gridWidth) <= 0) {
                            gridLines.splice(0, i);
                            break;
                        } else {
                            break;
                        }
                    }

                    return {itemLeft, itemTop};
                }

                for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

                    const item = items[itemIndex];
                    const previous = itemIndex > 0 ? items[itemIndex - 1] : undefined;

                    // czekamy na hydrację
                    while (!isHydrated(item)) {
                        await sleep(10);
                    }

                    if (!item[gridCacheProp]) {
                        const rect = item.getBoundingClientRect();
                        item[gridCacheProp] = {width: rect.width, height: rect.height};
                    }

                    item[gridCacheProp].index = itemIndex;

                    const itemWidth = item[gridCacheProp].width;
                    const itemHeight = item[gridCacheProp].height;

                    // @ts-ignore
                    const breakLine = item.getAttribute(lineBreakAttribute) === "before" || item.classList.contains(lineBreakAttribute) || (previous?.getAttribute(lineBreakAttribute) === "after") || gridRect.width === itemWidth;

                    const {itemLeft, itemTop} = addItemToMatrix(itemWidth, itemHeight);

                    if (!item[gridReadyProp]) {
                        item.style.left = `${itemLeft}px`;
                        item.style.top = `${itemTop}px`;
                        item[gridReadyProp] = true;
                        item[gridCacheProp].left = itemLeft;
                        item[gridCacheProp].top = itemTop;
                    }

                    item.style.visibility = "visible";

                    const bottom = item[gridCacheProp].top + item[gridCacheProp].height;
                    if (bottom > gridHeight) {
                        gridHeight = bottom;
                    }
                }

                if (gridHeight) {
                    this.itemsElement.style.height = `${gridHeight}px`;
                } else {
                    this.itemsElement.style.height = "0px";
                }

                this.lastWidth = this.itemsElement.getBoundingClientRect().width;
                this.lastItemsCount = items.length;

                if (Capacitor.getPlatform() === "ios") {
                    this.itemsElement.style.transform = "translateZ(0)";
                    const scroll: HTMLElement = await this.contentElement.getScrollElement();
                    scroll.style.overflowY = "hidden";
                    await sleep(200);
                    scroll.style.overflowY = "auto";
                    this.itemsElement.style.transform = "";
                }
            } else {
                console.debug("[ionx-masonry-grid] arrange not needed");
            }

        } finally {
            if (this.busy) {
                this.busy = false;
                console.debug("[ionx-masonry-grid] arrange finished")

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
        console.debug("[ionx-masonry-grid] window " + event.type);

        if (Capacitor.getPlatform() === "ios") {

            if (event.type === "resize") {
                return;
            }

            let width = event.detail.width;

            try {
                await waitTill(() => window.innerWidth === width, undefined, 2000);
            } catch {
            }
        }

        this.arrange({trigger: "onresize"});
    }

    viewPaused() {
        console.debug("[ionx-masonry-grid] app paused")
        this.paused = true;
    }

    viewResumed() {
        console.debug("[ionx-masonry-grid] app resumed, queued arrange: " + this.queuedArrange)
        this.paused = false;

        if (this.queuedArrange) {
            this.arrange({force: true});
        }
    }

    viewDidEnter() {
        console.debug("[ionx-masonry-grid] view did enter, queued arrange: " + this.queuedArrange)
        if (this.queuedArrange) {
            this.arrange({force: true});
        }
    }

    @Listen("visibilitychange", {target: "document"})
    visibilityChanged() {
        console.debug("[ionx-masonry-grid] visibility changed")
        if (document.visibilityState === "hidden") {
            this.viewPaused();
        } else if (document.visibilityState === "visible") {
            this.viewResumed();
        }
    }

    onMutation(_mutations: MutationRecord[]) {
        if (!this.waiting) {
            this.arrange();
        }
    }

    connectedCallback() {
        markAsUnready(this);

        this.init();
    }

    init() {

        this.contentElement = this.element.closest("ion-content");
        this.parentViewElement = this.element.closest(".ion-page");

        if (!this.contentElement || !this.parentViewElement || !this.itemsElement) {
            setTimeout(() => this.init());
            return;
        }

        this.pauseUnlisten = addEventListener(document, "pause", () => this.viewPaused());
        this.resumeUnlisten = addEventListener(document, "resume", () => this.viewResumed());
        this.viewDidEnterUnlisten = addEventListener(this.parentViewElement, "ionViewDidEnter", () => this.viewDidEnter())

        this.mutationObserver = new MutationObserver(mutations => this.onMutation(mutations));
        this.mutationObserver.observe(this.itemsElement, {childList: true, subtree: true, attributes: true});

        this.resizeObserver = new ResizeObserver(() => {
            const width = this.itemsElement.getBoundingClientRect().width;
            if (width > 0 && width !== this.lastWidth) {
                console.debug("[ionx-masonry-grid] container resized");
                this.arrange({trigger: "onresize"});
            }
        });
        this.resizeObserver.observe(this.itemsElement);

        this.breakpoints = new WidthBreakpointsContainer(this.itemsElement, "grid-width-breakpoints");

        this.arrange();
    }

    disconnectedCallback() {

        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;

        this.resizeObserver.disconnect();
        this.resizeObserver = undefined;

        this.breakpoints.disconnect();
        this.breakpoints = undefined;

        this.contentElement = undefined;
        this.parentViewElement = undefined;
        this.itemsElement = undefined;

        this.pauseUnlisten();
        this.pauseUnlisten = undefined;

        this.resumeUnlisten();
        this.resumeUnlisten = undefined;

        this.viewDidEnterUnlisten();
        this.viewDidEnterUnlisten = undefined;
    }

    render() {
        return <Host>
            <div ionx--grid-items style={this.innerStyle} ref={el => this.itemsElement = el}>
                <slot/>
            </div>
        </Host>;
    }

}
