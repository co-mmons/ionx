import {Component, ComponentInterface, Element, forceUpdate, h, Host, Prop, Watch} from "@stencil/core";
import {shallowEqual} from "fast-equals";
import VirtualScroller from "virtual-scroller";
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

    scroller: VirtualScroller;

    beforeItemsHeight: number;

    afterItemsHeight: number;

    @Watch("items")
    itemsChanged(newItems: any[]) {
        const {preserveScrollPositionOnPrependItems} = this;
        this.scroller.setItems(newItems, {preserveScrollPositionOnPrependItems});
    }

    connectedCallback() {
        const container = this.element;

        this.state = {};

        this.scroller = new VirtualScroller(() => container, this.items, {
            tbody: false,
            scrollableContainer: this.element.closest("ion-content").shadowRoot.querySelector(".inner-scroll"),
            getItemId: this.itemKey ? (item) => this.itemKey(item) : undefined,
            getState: () => this.state,
            setState: (state: any, callbacks: {willUpdateState: (niu, prev) => void, didUpdateState: (prev) => void}) => {

                this.prevState = this.state;

                const newState = {...this.prevState, ...state};

                if (!shallowEqual(this.prevState, newState)) {
                    callbacks.willUpdateState(newState, this.prevState);
                    this.didUpdateState = callbacks.didUpdateState;
                    this.state = newState;
                    forceUpdate(this);
                }
            }
        });

    }

    componentDidLoad() {
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
        this.scroller.stop();

    }

    render() {

        const {items, firstShownItemIndex, lastShownItemIndex, beforeItemsHeight, afterItemsHeight, itemHeights} = this.state;

        if (itemHeights.find(h => typeof h === "number") || items.length === 0) {
            this.beforeItemsHeight = beforeItemsHeight;
            this.afterItemsHeight = afterItemsHeight;
        }

        const itemsToRender: [item: any, index: number][] = [];
        for (let i = firstShownItemIndex; i <= lastShownItemIndex; i++) {
            itemsToRender.push([items[i], i]);
        }

        return <Host style={{display: "block", paddingTop: `${this.beforeItemsHeight}px`, paddingBottom: `${this.afterItemsHeight}px`}}>
            {itemsToRender.map(item => this.renderItem(item[0], item[1]))}
        </Host>
    }
}