import {Component, ComponentInterface, Element, forceUpdate, h, Host, Prop, Watch} from "@stencil/core";
import {shallowEqual} from "fast-equals";
import {waitTillHydrated} from "ionx/utils";
import VirtualScroller, {State} from "virtual-scroller";
import engine from "./engine.js";

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

    state: Partial<State<any>>;

    scroller: VirtualScroller<HTMLElement, any>;

    initScroller() {

        this.state = {
            items: this.items,
            firstShownItemIndex: 50,
            lastShownItemIndex: 100,
            itemHeights: new Array(this.items.length),
            afterItemsHeight: 0,
            beforeItemsHeight: 0,
            itemStates: new Array(this.items.length)
        }

        this.scroller = new VirtualScroller(() => this.element, this.items, {
            tbody: false,
            engine,
            scrollableContainer: this.element.closest("ion-content").shadowRoot.querySelector(".inner-scroll"),
            getItemId: this.itemKey ? (item) => this.itemKey(item) : undefined
        });

        this.scroller.useState({
            getState: (): State<any> => {
                return this.state as any;
            },
            updateState: (stateUpdate: Partial<State<any>>) => {
                const prev = this.state;
                const state = {...prev, ...stateUpdate};
                // console.debug("%c[ionx-virtual-scroller] update state", "color: green; font-weight: bold; font-size: 120%", stateUpdate);

                if (prev.items !== state.items) {
                    state.afterItemsHeight = prev.afterItemsHeight;
                    state.beforeItemsHeight = prev.beforeItemsHeight;
                }

                if (!shallowEqual(prev, state)) {
                    this.state = state;
                    forceUpdate(this);
                }
            }
        })

    }

    componentDidRender() {
        this.scroller?.onRender();
    }

    @Watch("items")
    itemsChanged(items: any[], _old: any) {

        if (Array.isArray(items) && items.length > 0 && !this.scroller) {
            this.initScroller();
            setTimeout(() => this.scroller.start());
        } else {
            const {preserveScrollPositionOnPrependItems, state} = this;
            const firstItemPosition = this.scroller.getItemScrollPosition(state.firstShownItemIndex);
            console.log(firstItemPosition)
            this.scroller.setItems(items, {preserveScrollPositionOnPrependItems});
        }
    }

    componentShouldUpdate(_new: any, _old: any, propName: string): boolean | void {
        if (propName === "items") {
            return false;
        }
    }

    connectedCallback() {
        this.initScroller();
    }

    async componentDidLoad() {
        await waitTillHydrated(this.element.closest("ion-content"));
        setTimeout(() => this.scroller.start());
    }

    disconnectedCallback() {
        this.scroller?.stop();
    }

    render() {

        let {items, firstShownItemIndex, lastShownItemIndex, beforeItemsHeight, afterItemsHeight} = this.state;

        if (!items) {
            items = this.items;
        }

        const itemsToRender: [item: any, index: number][] = [];
        for (let i = firstShownItemIndex; i <= lastShownItemIndex; i++) {
            if (items.length > i) {
                itemsToRender.push([items[i], i]);
            }
        }
        // console.debug("%c[ionx-virtual-scroller] render", "color: magenta; font-weight: bold", firstShownItemIndex, lastShownItemIndex);

        return <Host style={{display: "block", paddingTop: `${beforeItemsHeight}px`, paddingBottom: `${afterItemsHeight}px`}}>
            {itemsToRender.map(item => this.renderItem(item[0], item[1]))}
        </Host>
    }
}
