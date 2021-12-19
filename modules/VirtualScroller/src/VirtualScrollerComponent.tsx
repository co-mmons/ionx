import {Component, ComponentInterface, Element, forceUpdate, h, Host, Prop, Watch} from "@stencil/core";
import {shallowEqual} from "fast-equals";
import {waitTillHydrated} from "ionx/utils";
import VirtualScroller from "virtual-scroller";
import engine from "./engine.js";
import {VirtualScrollerState} from "./VirtualScrollerState";

@Component({
    tag: "ionx-virtual-scroller",
    styleUrl: "VirtualScrollerComponent.scss"
})
export class VirtualScrollerComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    items!: any[];

    @Prop()
    renderItem: (item: any, index: number) => any;

    @Prop()
    itemKey?: (item: any) => any;

    @Prop()
    preserveScrollPositionOnPrependItems = true;

    @Prop()
    estimatedItemHeight: number;

    state: VirtualScrollerState;

    prevState: VirtualScrollerState;

    didUpdateState: (prevState: VirtualScrollerState) => void;

    scroller: VirtualScroller<HTMLElement, any>;

    beforeItemsHeight: number;

    afterItemsHeight: number;

    initScroller() {

        this.scroller = new VirtualScroller(() => this.element, this.items, {
            tbody: false,
            engine,
            scrollableContainer: this.element.closest("ion-content").shadowRoot.querySelector(".inner-scroll"),
            getItemId: this.itemKey ? (item) => this.itemKey(item) : undefined,
            getState: () => this.state as any,
            setState: (state: any, callbacks?: {willUpdateState: (niu, prev) => void, didUpdateState: (prev) => void}) => {

                this.prevState = this.state;

                const newState = {...this.prevState, ...state};

                if (!shallowEqual(this.prevState, newState)) {
                    callbacks.willUpdateState(newState, this.prevState);
                    this.didUpdateState = callbacks.didUpdateState;
                    this.state = newState;
                    forceUpdate(this);

                    if (!this.state.items || this.state.items.length === 0) {
                        this.scroller.stop();
                        this.scroller = undefined;
                    }
                }
            }
        } as any);

    }

    @Watch("items")
    itemsChanged(items: any[], _old: any) {

        if (Array.isArray(items) && items.length > 0 && !this.scroller) {
            this.initScroller();
            setTimeout(() => this.scroller.listen());
        } else {
            const {preserveScrollPositionOnPrependItems} = this;
            this.scroller.setItems(items, {preserveScrollPositionOnPrependItems});
        }
    }

    componentShouldUpdate(_new: any, _old: any, propName: string): boolean | void {
        if (propName === "items") {
            return false;
        }
    }

    connectedCallback() {
        this.state = {};
        this.initScroller();
    }

    async componentDidLoad() {
        await waitTillHydrated(this.element.closest("ion-content"));
        setTimeout(() => this.scroller.listen());
    }

    componentDidRender() {

        if (this.didUpdateState) {
            const update = this.didUpdateState;
            const state = this.prevState;
            setTimeout(() => update(state));

            this.didUpdateState = undefined;
        }
    }

    disconnectedCallback() {
        this.scroller?.stop();
    }

    render() {
        console.debug("[ionx-virtual-scroller] render")

        const {items, firstShownItemIndex, lastShownItemIndex, beforeItemsHeight, afterItemsHeight, itemHeights} = this.state;

        if (itemHeights.find(h => typeof h === "number") || items.length === 0) {
            this.beforeItemsHeight = beforeItemsHeight;
            this.afterItemsHeight = afterItemsHeight;
        }

        const itemsToRender: [item: any, index: number][] = [];
        for (let i = firstShownItemIndex; i <= lastShownItemIndex; i++) {
            if (items.length > i) {
                itemsToRender.push([items[i], i]);
            }
        }

        return <Host style={{display: "block", paddingTop: `${this.beforeItemsHeight}px`, paddingBottom: `${this.afterItemsHeight}px`}}>
            {itemsToRender.map(item => this.renderItem(item[0], item[1]))}
        </Host>
    }
}
