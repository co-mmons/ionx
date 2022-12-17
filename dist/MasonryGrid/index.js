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

const gridCacheProp = "__ionxMasonryGridCache";
const gridReadyProp = "__ionxMasonryGridReady";
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
    extended[gridReadyProp] = false;
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
          item[gridReadyProp] = false;
          item[gridCacheProp] = undefined;
          item.style.display = "none";
        }
      }
      else {
        // we must check which items must be repositioned
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          // zmieniła się pozycja itemu
          if (item[gridCacheProp]?.index !== i) {
            item[gridReadyProp] = false;
          }
          // jeżeli poprzedni item wymaga renderu, to jego sąsiad również
          if (i > 0 && !items[i - 1][gridReadyProp]) {
            item[gridReadyProp] = false;
          }
          const rect = item.getBoundingClientRect();
          if (item[gridCacheProp]?.width !== rect.width || item[gridCacheProp]?.height !== rect.height) {
            item[gridReadyProp] = false;
          }
          if (!item[gridReadyProp]) {
            item[gridCacheProp] = { width: rect.width, height: rect.height };
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
          if (!item[gridReadyProp]) {
            item.style.top = "-100%";
            item.style.left = "-100%";
            item.style.display = "block";
            item.style.visibility = "hidden";
          }
        }
        const sortSectionItems = (a, b) => {
          const ar = a[gridCacheProp];
          const br = b[gridCacheProp];
          if (ar.top + ar.height === br.top + br.height) {
            return br.left - ar.left;
          }
          else {
            return (br.top + br.height) - (ar.top + ar.height);
          }
        };
        // itemy aktualnie przetwarzanej sekcji
        // po każdym dodaniu, należy posortować
        let sectionItems = [];
        // const itemsPositions: {[index: number]: {left: number, top: number}} = {};
        let gridRect = this.itemsElement.getBoundingClientRect();
        let gridHeight = 0;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
          const item = items[itemIndex];
          const previous = itemIndex > 0 ? items[itemIndex - 1] : undefined;
          // czekamy na hydrację
          while (!isHydrated(item)) {
            await sleep(10);
          }
          if (!item[gridCacheProp]) {
            const rect = item.getBoundingClientRect();
            item[gridCacheProp] = { width: rect.width, height: rect.height };
          }
          item[gridCacheProp].index = itemIndex;
          const itemWidth = item[gridCacheProp].width;
          const breakLine = item.getAttribute(lineBreakAttribute) === "before" || item.classList.contains(lineBreakAttribute) || (previous?.getAttribute(lineBreakAttribute) === "after") || gridRect.width === itemWidth;
          const isNewSection = sectionItems.length === 0 || breakLine;
          // czy w ramach sekcji itemy są już zawijane, czyli dodawane nie w pierwszej linii
          // a wg wysokości itemów
          let cascade = false;
          // element, pod którym mam być wstawiony ten element
          // w przypadku nowej linii albo puste, albo element, który jest najbardziej wysunięty do dołu
          let sibling;
          if (isNewSection) {
            sibling = (sectionItems.length && sectionItems[0]) || (itemIndex > 0 && items[itemIndex - 1]);
            sectionItems = [];
            cascade = false;
          }
          else {
            sibling = previous;
            // nie ma już miejsca w pierwszej lini sekcji, trzeba zawijać i szukać itemu, pod którym jest miejsce
            if (~~(sibling[gridCacheProp].left - gridRect.left + sibling[gridCacheProp].width + itemWidth) > gridRect.width) {
              cascade = true;
              sibling = undefined;
            }
          }
          if (cascade) {
            sibling = sectionItems.pop();
          }
          // usuwamy itemy z sekcji, bo wychodzimy poza szerokość gridu
          while (sectionItems.length > 1 && previous !== sibling && ~~(sibling[gridCacheProp].left + itemWidth) > gridRect.width) {
            sibling = sectionItems.pop();
          }
          // usuwamy itemy z sekcji, bo sibling.left koliduje z poprzednim item - dlugosc poprzedniego wykracza poza sibling.left
          while (previous && sibling && previous !== sibling && sectionItems.length > 1 && sibling && sibling[gridCacheProp].top !== previous[gridCacheProp].top && previous[gridCacheProp].left < sibling[gridCacheProp].left && previous[gridCacheProp].left + previous[gridCacheProp].width >= sibling[gridCacheProp].left) {
            sibling = sectionItems.pop();
          }
          let itemLeft = isNewSection ? 0 : (sibling[gridCacheProp].left + (!cascade ? sibling[gridCacheProp].width : 0));
          let itemTop = !sibling ? 0 : (sibling[gridCacheProp].top + (cascade || isNewSection ? sibling[gridCacheProp].height : 0));
          // usuwamy poprzednie itemy z sekcji, jeżeli item nachodzi na poprzedni
          for (const i of sectionItems.reverse()) {
            const ic = i[gridCacheProp];
            if (itemTop !== ic.top && ic.left > itemLeft && itemTop < ic.top + ic.height && itemLeft + itemWidth > ic.left) {
              sectionItems.pop();
              itemTop = ic.top + ic.height;
              break;
            }
          }
          // usuwamy poprzednie itemy z sekcji, jeżeli koniec poprzedniego jest dokładnie w tym samym miejscu gdzie obecny
          for (let i = sectionItems.length - 1; i >= 0; i--) {
            const ic = sectionItems[i][gridCacheProp];
            if (itemLeft + itemWidth === ic.left + ic.width) {
              sectionItems.splice(i, 1);
            }
          }
          if (!item[gridReadyProp]) {
            item.style.left = `${itemLeft}px`;
            item.style.top = `${itemTop}px`;
            item[gridReadyProp] = true;
            item[gridCacheProp].left = itemLeft;
            item[gridCacheProp].top = itemTop;
            // item[gridCacheProp].bottom = item.getBoundingClientRect().bottom;
          }
          item.style.visibility = "visible";
          if (!isNewSection || !breakLine) {
            sectionItems.push(item);
            sectionItems.sort(sortSectionItems);
          }
          const bottom = item[gridCacheProp].top + item[gridCacheProp].height;
          if (bottom > gridHeight) {
            gridHeight = bottom;
          }
          // console.log(item, itemLeft, itemTop);
          // console.log(itemTop, siblingRect?.height);
          // if (sibling && itemLeft === itemsPositions[sibling["index"]].left && itemsPositions[sibling["index"]].top + siblingRect.height > itemTop) {
          // console.log("error", item.element.innerText, itemTop, "sibling", sibling.element.innerText, itemsPositions[sibling["index"]].top, siblingRect.top, siblingRect.height);
          // }
        }
        gridRect = this.itemsElement.getBoundingClientRect();
        if (gridHeight) {
          this.itemsElement.style.height = `${gridHeight}px`;
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
        console.debug("[ionx-masonry-grid] arrange finished");
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
    return h(Host, { class: { "ionx--block": this.block } }, h("div", { "ionx--grid-items": true, style: this.innerStyle, ref: el => this.itemsElement = el }, h("slot", null)));
  }
  get element() { return this; }
  static get style() { return masonryGridCss; }
};

const IonxMasonryGrid = /*@__PURE__*/proxyCustomElement(MasonryGrid, [6,"ionx-masonry-grid",{"block":[4],"innerStyle":[8,"inner-style"]},[[8,"beforeresize","resized"],[9,"resize","resized"],[4,"visibilitychange","visibilityChanged"]]]);
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
