import { HTMLElement, forceUpdate, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { shallowEqual } from 'fast-equals';
import VirtualScroller from './Volumes/Projekty/co.mmons/ionx/node_modules/virtual-scroller/index.js';

const virtualScrollerComponentCss = "ionx-virtual-scroller{display:block}";

let VirtualScrollerComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.preserveScrollPositionOnPrependItems = true;
  }
  itemsChanged(newItems) {
    const { preserveScrollPositionOnPrependItems } = this;
    this.scroller.setItems(newItems, { preserveScrollPositionOnPrependItems });
  }
  connectedCallback() {
    const container = this.element;
    this.state = {};
    this.scroller = new VirtualScroller(() => container, this.items, {
      tbody: false,
      scrollableContainer: this.element.closest("ion-content").shadowRoot.querySelector(".inner-scroll"),
      getItemId: this.itemKey ? (item) => this.itemKey(item) : undefined,
      getState: () => this.state,
      setState: (state, callbacks) => {
        this.prevState = this.state;
        const newState = { ...this.prevState, ...state };
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
    const { items, firstShownItemIndex, lastShownItemIndex, beforeItemsHeight, afterItemsHeight, itemHeights } = this.state;
    if (itemHeights.find(h => typeof h === "number") || items.length === 0) {
      this.beforeItemsHeight = beforeItemsHeight;
      this.afterItemsHeight = afterItemsHeight;
    }
    const itemsToRender = [];
    for (let i = firstShownItemIndex; i <= lastShownItemIndex; i++) {
      itemsToRender.push([items[i], i]);
    }
    return h(Host, { style: { display: "block", paddingTop: `${this.beforeItemsHeight}px`, paddingBottom: `${this.afterItemsHeight}px` } }, itemsToRender.map(item => this.renderItem(item[0], item[1])));
  }
  get element() { return this; }
  static get watchers() { return {
    "items": ["itemsChanged"]
  }; }
  static get style() { return virtualScrollerComponentCss; }
};

const IonxVirtualScroller = /*@__PURE__*/proxyCustomElement(VirtualScrollerComponent, [0,"ionx-virtual-scroller",{"items":[16],"renderItem":[16],"itemKey":[16],"preserveScrollPositionOnPrependItems":[4,"preserve-scroll-position-on-prepend-items"],"estimatedItemHeight":[2,"estimated-item-height"]}]);
const defineIonxVirtualScroller = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxVirtualScroller
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxVirtualScroller, defineIonxVirtualScroller };
