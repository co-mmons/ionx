import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { Capacitor } from '@capacitor/core';
import { sleep, waitTill } from '@co.mmons/js-utils/core';
import { isHydrated, markAsReady, markAsUnready, addEventListener } from 'ionx/utils';
import { WidthBreakpointsContainer } from 'ionx/WidthBreakpoints';

const lineBreakAttribute = "ionx-masonry-grid-line-break";
function lineBreak(beforeOrAfter = "before") {
  if (!beforeOrAfter) {
    return {};
  }
  else {
    return { [lineBreakAttribute]: beforeOrAfter === "before" || beforeOrAfter === true ? "before" : "after" };
  }
}

const MasonryGrid$1 = "ionx-masonry-grid";

const masonryGridCss = ".sc-ionx-masonry-grid-h{display:block;position:relative;margin:8px}.sc-ionx-masonry-grid-h [ionx--grid-items].sc-ionx-masonry-grid{display:block;position:relative;--grid-container-width:100%}.ionx--block.sc-ionx-masonry-grid-h [ionx--grid-items].sc-ionx-masonry-grid{height:auto !important}.sc-ionx-masonry-grid-h:not(.ionx--block) [ionx--grid-items].sc-ionx-masonry-grid-s>*{position:absolute;display:none}.sc-ionx-masonry-grid-h.ionx--block [ionx--grid-items].sc-ionx-masonry-grid-s>*{left:unset;top:unset}";

let MasonryGrid = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.paused = false;
  }
  isParentViewActive() {
    return !this.parentViewElement?.classList.contains("ion-page-hidden");
  }
  items() {
    const items = [];
    const children = this.itemsElement?.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        items.push(children[i]);
      }
    }
    return items;
  }
  async markItemAsDirty(item) {
    const extended = item;
    extended.__ionxMasonryGridReady = false;
    this.arrange({ force: true });
  }
  async arrange(options) {
    let waiting = false;
    // we must wait until already started process finish its work
    while (this.busy) {
      // another process is waiting, so we can cancel this process
      if (!waiting && this.waiting) {
        console.debug("[ionx-masonry-grid] quit waiting");
        return;
      }
      this.waiting = waiting = true;
      await sleep(10);
    }
    // if arranging must be done because of changes in the content or sizes
    let doArrange = false;
    this.busy = true;
    this.waiting = undefined;
    // grid is to be displayed as block element, just make sure that items are hydrated
    // when yes, mark as ready and we are done
    if (this.block) {
      console.debug("[ionx-masonry-grid] render as block");
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
        console.debug("[ionx-masonry-grid] queue arrange new:" + this.itemsElement.getBoundingClientRect().width + ", old:" + this.lastWidth);
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
          item.__ionxMasonryGridReady = false;
          item.style.display = "none";
        }
      }
      else {
        // we must check which items must be repositioned
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          // zmieniła się pozycja itemu
          if (item.__ionxMasonryGridCache?.index !== i) {
            item.__ionxMasonryGridReady = false;
          }
          // jeżeli poprzedni item wymaga renderu, to jego sąsiad również
          if (i > 0 && !items[i - 1].__ionxMasonryGridReady) {
            item.__ionxMasonryGridReady = false;
          }
          const rect = item.getBoundingClientRect();
          if (item.__ionxMasonryGridCache?.rect?.width !== rect.width || item.__ionxMasonryGridCache?.rect?.height !== rect.height) {
            item.__ionxMasonryGridReady = false;
            if (!item.__ionxMasonryGridCache) {
              item.__ionxMasonryGridCache = { rect };
            }
          }
          if (!item.__ionxMasonryGridReady) {
            doArrange = true;
            item.style.display = "none";
          }
        }
        // najpewniej usunięte zostały itemy na końcu gridu
        if (items.length !== this.lastItemsCount) {
          doArrange = true;
        }
      }
      // ok, możemy przystąpić do renderowania
      ARRANGE: if (doArrange) {
        console.debug("[ionx-masonry-grid] arrange started");
        // upewniamy się, że możemy renderować - kontener musi mieć jakąś szerokość
        if (this.itemsElement.getBoundingClientRect().width === 0) {
          try {
            await waitTill(() => this.itemsElement.getBoundingClientRect().width > 0, undefined, 5000);
          }
          catch {
            console.debug("[ionx-masonry-grid] unable to arrange, container has not width");
            break ARRANGE;
          }
        }
        // resetujemy brudne itemy - ustawiamy pozycję na 0x0
        for (const item of items) {
          if (!item.__ionxMasonryGridReady) {
            item.style.top = "-100%";
            item.style.left = "-100%";
            item.style.display = "block";
            item.style.visibility = "hidden";
          }
        }
        const sortSectionItems = (a, b) => {
          const ar = a.getBoundingClientRect();
          const br = b.getBoundingClientRect();
          if (ar.bottom === br.bottom) {
            return br.left - ar.left;
          }
          else {
            return br.bottom - ar.bottom;
          }
        };
        // itemy aktualnie przetwarzanej sekcji
        // po każdym dodaniu, należy posortować
        let sectionItems = [];
        // czy w ramach sekcji itemy są już zawijane, czyli dodawane nie w pierwszej lini
        // a wg wysokości itemów
        let sectionCascade = false;
        const itemsPositions = {};
        let gridRect = this.itemsElement.getBoundingClientRect();
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
          const item = items[itemIndex];
          const previous = itemIndex > 0 ? items[itemIndex - 1] : undefined;
          if (!item.__ionxMasonryGridCache) {
            item.__ionxMasonryGridCache = {};
          }
          item.__ionxMasonryGridCache.index = itemIndex;
          // czekamy na hydrację
          while (!isHydrated(item)) {
            await sleep(10);
          }
          if (!item.__ionxMasonryGridReady || !item.__ionxMasonryGridCache.rect) {
            item.__ionxMasonryGridCache.rect = item.getBoundingClientRect();
          }
          const breakLine = item.getAttribute(lineBreakAttribute) === "before" || item.classList.contains(lineBreakAttribute) || (previous?.getAttribute(lineBreakAttribute) === "after") || gridRect.width === item.__ionxMasonryGridCache.rect.width;
          const isNewSection = sectionItems.length === 0 || breakLine;
          // element, pod którym mam być wstawiony ten element
          // w przypadku nowej lini albo puste, albo element, który jest najbardziej wysunięty do dołu
          let sibling;
          if (isNewSection) {
            sibling = (sectionItems.length && sectionItems[0]) || (itemIndex > 0 && items[itemIndex - 1]);
            sectionItems = [];
            sectionCascade = false;
          }
          else if (!sectionCascade) {
            sibling = previous;
            // console.log(sibling.__ionxMasonryCache.rect.left - gridRect.left, sibling.__ionxMasonryCache.rect.width, item.__ionxMasonryCache.rect.width, gridRect.width);
            // console.log((sibling.__ionxMasonryCache.rect.left - gridRect.left + sibling.__ionxMasonryCache.rect.width + item.__ionxMasonryCache.rect.width), gridRect.width);
            // console.log(sibling.__ionxMasonryCache.rect.left, gridRect.left, sibling.__ionxMasonryCache.rect.width, item.__ionxMasonryCache.rect.width, gridRect.width);
            // nie ma już miejsca w pierwszej lini sekcji, trzeba zawijać i szukać itemu, pod którym jest miejsce
            if (~~(sibling.__ionxMasonryGridCache.rect.left - gridRect.left + sibling.__ionxMasonryGridCache.rect.width + item.__ionxMasonryGridCache.rect.width) > gridRect.width) {
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
          let itemLeft;
          let itemTop;
          if (!item.__ionxMasonryGridReady) {
            // console.log("item", item);
            // console.log("sibling", sibling);
            // console.log("---", itemIndex);
            itemLeft = isNewSection ? 0 : (itemsPositions[sibling.__ionxMasonryGridCache.index].left + (!sectionCascade ? sibling.__ionxMasonryGridCache.rect.width : 0));
            itemTop = !sibling ? 0 : (itemsPositions[sibling.__ionxMasonryGridCache.index].top + (sectionCascade || isNewSection ? sibling.__ionxMasonryGridCache.rect.height : 0));
            // console.log(itemLeft, sibling, sibling && itemsPositions[sibling.__ionxMasonryCache.index].left);
            item.style.left = `${itemLeft}px`;
            item.style.top = `${itemTop}px`;
            item.__ionxMasonryGridReady = true;
            item.__ionxMasonryGridCache.left = itemLeft;
            item.__ionxMasonryGridCache.top = itemTop;
            item.__ionxMasonryGridCache.rect = item.getBoundingClientRect();
          }
          else {
            itemLeft = item.__ionxMasonryGridCache.left;
            itemTop = item.__ionxMasonryGridCache.top;
          }
          itemsPositions[item.__ionxMasonryGridCache.index] = { left: itemLeft, top: itemTop };
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
        gridRect = this.itemsElement.getBoundingClientRect();
        const lowestItem = (sectionItems.length && sectionItems[0]) || (items.length && items[items.length - 1]);
        if (lowestItem) {
          const rect = lowestItem.getBoundingClientRect();
          this.itemsElement.style.height = `${rect.top - gridRect.top + rect.height}px`;
        }
        else {
          this.itemsElement.style.height = "0px";
        }
        this.lastWidth = gridRect.width;
        this.lastItemsCount = items.length;
        if (Capacitor.getPlatform() === "ios") {
          this.itemsElement.style.transform = "translateZ(0)";
          const scroll = await this.contentElement.getScrollElement();
          scroll.style.overflowY = "hidden";
          await sleep(200);
          scroll.style.overflowY = "auto";
          this.itemsElement.style.transform = "";
        }
      }
      else {
        console.debug("[ionx-masonry-grid] arrange not needed");
      }
    }
    finally {
      if (this.busy) {
        this.busy = false;
        markAsReady(this);
        if (!this.isParentViewActive() || this.paused) {
          this.arrange();
        }
        else if (options?.trigger === "onresize") {
          setTimeout(() => this.arrange());
        }
      }
    }
  }
  async resized(event) {
    console.debug("[ionx-masonry-grid] window " + event.type);
    if (Capacitor.getPlatform() === "ios") {
      if (event.type === "resize") {
        return;
      }
      let width = event.detail.width;
      try {
        await waitTill(() => window.innerWidth === width, undefined, 2000);
      }
      catch {
      }
    }
    this.arrange({ trigger: "onresize" });
  }
  viewPaused() {
    console.debug("[ionx-masonry-grid] app paused");
    this.paused = true;
  }
  viewResumed() {
    console.debug("[ionx-masonry-grid] app resumed, queued arrange: " + this.queuedArrange);
    this.paused = false;
    if (this.queuedArrange) {
      this.arrange({ force: true });
    }
  }
  viewDidEnter() {
    console.debug("[ionx-masonry-grid] view did enter, queued arrange: " + this.queuedArrange);
    if (this.queuedArrange) {
      this.arrange({ force: true });
    }
  }
  visibilityChanged() {
    console.debug("[ionx-masonry-grid] visibility changed");
    if (document.visibilityState === "hidden") {
      this.viewPaused();
    }
    else if (document.visibilityState === "visible") {
      this.viewResumed();
    }
  }
  onMutation(_mutations) {
    this.arrange();
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
    this.resumeUnlisten = addEventListener(document, "resume", () => this.viewPaused());
    this.viewDidEnterUnlisten = addEventListener(this.parentViewElement, "ionViewDidEnter", () => this.viewDidEnter());
    this.mutationObserver = new MutationObserver(mutations => this.onMutation(mutations));
    this.mutationObserver.observe(this.itemsElement, { childList: true, subtree: true, attributes: true });
    this.resizeObserver = new ResizeObserver(() => {
      const width = this.itemsElement.getBoundingClientRect().width;
      if (width > 0 && width !== this.lastWidth) {
        console.debug("[ionx-masonry-grid] container resized");
        this.arrange({ trigger: "onresize" });
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
    return h(Host, { class: { "ionx--block": this.block } }, h("div", { "ionx--grid-items": true, ref: el => this.itemsElement = el }, h("slot", null)));
  }
  get element() { return this; }
  static get style() { return masonryGridCss; }
};

const IonxMasonryGrid = /*@__PURE__*/proxyCustomElement(MasonryGrid, [6,"ionx-masonry-grid",{"block":[4]},[[8,"beforeresize","resized"],[9,"resize","resized"],[4,"visibilitychange","visibilityChanged"]]]);
const defineIonxMasonryGrid = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxMasonryGrid
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};
defineIonxMasonryGrid();

export { IonxMasonryGrid, MasonryGrid$1 as MasonryGrid, defineIonxMasonryGrid, lineBreak, lineBreakAttribute };
