import {Component, Element, forceUpdate, FunctionalComponent, h, Host, Prop, VNode} from "@stencil/core";
import {addEventListener, EventUnlisten} from "../misc";

const indexAttribute = "__ionx-vl-idx";

@Component({
    tag: "ionx-virtual-scroll"
})
export class VirtualScroll {

    @Element()
    element: HTMLElement;

    scrollElement: HTMLElement;

    @Prop()
    items!: any[];

    @Prop()
    itemWidth: number;

    @Prop()
    itemHeight = 30;

    @Prop()
    renderer!: (index: number) => VNode;

    firstVisibleIndex: number;

    renderVisibleIndex: number;

    threshold = 100;

    intersectionObserver: IntersectionObserver;

    mutationObserver: MutationObserver;

    scrollUnlisten: EventUnlisten;

    onIntersection(entries: IntersectionObserverEntry[]) {
        // console.log(entries);

        const prevFirst = this.firstVisibleIndex;

        for (const entry of entries) {

            const index = parseInt(entry.target.getAttribute(indexAttribute), 10);

            const rect = entry.boundingClientRect;
            const root = entry.rootBounds;

            if (root.bottom === 0) {
                continue;
            }

            if (isNaN(index)) {
                continue;
            }

            if ((rect.top < 0 && entry.isIntersecting) || (rect.top <= root.bottom && !entry.isIntersecting)) {
                this.firstVisibleIndex = index;
                console.log(this.firstVisibleIndex);
            } else if (rect.top <= root.bottom && entry.isIntersecting) {
                // // console.log(index, "last in the viewport");
                // this.last = index;
            }
        }

        if (Math.floor(prevFirst / (this.threshold / 2)) !== Math.floor(this.firstVisibleIndex / (this.threshold / 2))) {
            console.log(prevFirst, this.firstVisibleIndex);
            this.renderVisibleIndex = this.firstVisibleIndex;
            forceUpdate(this);
        }
    }

    onMutation(records: MutationRecord[]) {
        for (const record of records) {
            record.addedNodes?.forEach(n => n instanceof HTMLElement && this.intersectionObserver.observe(n));
            record.removedNodes?.forEach(n => n instanceof HTMLElement && n.hasAttribute(indexAttribute) && this.intersectionObserver.unobserve(n));
        }
    }

    async onScroll(ev: Event) {

        if (!this.scrollElement) {
            this.scrollElement = await (ev.target as HTMLIonContentElement).getScrollElement();
        }

        // console.log(this.scrollElement.scrollTop);
    }

    connectedCallback() {

        const content = this.element.closest<HTMLIonContentElement>("ion-content");
        content.scrollEvents = true;

        addEventListener(content, "ionScroll", (ev) => this.onScroll(ev));

        this.intersectionObserver = new IntersectionObserver(entries => this.onIntersection(entries), {
            root: this.element.closest("ion-content")
        });

        this.mutationObserver = new MutationObserver(records => this.onMutation(records));
        this.mutationObserver.observe(this.element, {childList: true});

        if (this.firstVisibleIndex === undefined) {
            this.firstVisibleIndex = 0;
            this.renderVisibleIndex = 0;
        }
    }

    render() {

        const RendererProxy: FunctionalComponent<{index: number}> = (props, children) => {

            const child = children[0];

            if (!child.$attrs$) {
                child.$attrs$ = {};
            }

            // child.$key$ = props.index;
            child.$attrs$[indexAttribute] = props.index;

            return children;
        };

        let firstIndex: number;
        let lastIndex: number;

        for (let i = 0; i < this.items.length; i++) {
            if (i >= this.renderVisibleIndex - this.threshold && i <= this.renderVisibleIndex + this.threshold) {
                if (firstIndex === undefined) {
                    firstIndex = i;
                }

                lastIndex = i;
            }
        }

        const marginTop = firstIndex * this.itemHeight;
        const marginBottom = (this.items.length - lastIndex - 1) * this.itemHeight;

        console.log(firstIndex, lastIndex);

        return <Host style={{display: "block"}}>
            <div key="__top" style={{height: `${marginTop}px`}}/>
            {this.items.map((_item, index) => index >= firstIndex && index <= lastIndex && <RendererProxy index={index}>{this.renderer(index)}</RendererProxy>)}
            <div key="__bottom" style={{height: `${marginBottom}px`}}/>
        </Host>;
    }
}
