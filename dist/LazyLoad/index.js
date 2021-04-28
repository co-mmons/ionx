import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { isHydrated, waitTillHydrated } from 'ionx/utils';

function ensureLazyLoad(contentOrOptions, options) {
  const contentElements = contentOrOptions instanceof HTMLElement ? [contentOrOptions] : document.body.querySelectorAll("ion-content");
  if (!(contentOrOptions instanceof HTMLElement)) {
    options = contentOrOptions;
  }
  for (let i = 0; i < contentElements.length; i++) {
    if (contentElements[i].__ionxLazyLoad) {
      contentElements[i].__ionxLazyLoad.ensureLoaded({ retryError: options === null || options === void 0 ? void 0 : options.retryError });
    }
  }
}

const itemCssClassPrefix = "ionx-lazy-load";
const itemPendingCssClass = `${itemCssClassPrefix}-pending`;
const itemErrorCssClass = `${itemCssClassPrefix}-error`;
const itemLoadingCssClass = `${itemCssClassPrefix}-loading`;
const itemLoadedCssClass = `${itemCssClassPrefix}-loaded`;

function styleParents(element, parents) {
  if (!parents) {
    return;
  }
  for (const parentSelector in parents) {
    const parent = element.closest(parentSelector);
    if (parent) {
      const prefix = parents[parentSelector] || "";
      parent.classList.remove(`${prefix}-pending`);
      for (const state of ["loading", "loaded", "error"]) {
        if (element.classList.contains(`${itemCssClassPrefix}-${state}`)) {
          parent.classList.add(`${prefix}${state}`);
        }
        else {
          parent.classList.remove(`${prefix}${state}`);
        }
      }
    }
  }
}

const srcSupportedTagNames = ["IMG", "VIDEO", "IFRAME"];
class LazyLoadController {
  constructor(content) {
    this.containers = [];
    this.content = content;
    this.init();
  }
  callback(entries) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setTimeout(() => this.loadItem(entry.target));
      }
    }
  }
  loadItem(element) {
    const srcSupported = srcSupportedTagNames.includes(element.tagName);
    const options = element.__lazyLoadOptions;
    delete element.__lazyLoadSrc;
    element.classList.remove(itemPendingCssClass);
    element.classList.add(itemLoadingCssClass);
    styleParents(element, options === null || options === void 0 ? void 0 : options.styleParents);
    const load = (afterError) => {
      if (element.lazyLoad) {
        if (!afterError) {
          element.lazyLoad(options);
        }
        else {
          markAsError();
        }
      }
      else if (options === null || options === void 0 ? void 0 : options.src) {
        const src = Array.isArray(options.src) ? options.src : [options.src];
        if (src.length === 0) {
          console.warn("[ionx-lazy-load] element cannot be lazy loaded, no src given", element);
          markAsError();
        }
        else {
          const lastSrcIndex = src.lastIndexOf((srcSupported && element.getAttribute("src")) || element.__lazyLoadSrc || null);
          if (lastSrcIndex >= src.length - 1) {
            markAsError();
          }
          else if (srcSupported) {
            element.setAttribute("src", src[lastSrcIndex + 1]);
          }
          else {
            const img = new Image();
            img.addEventListener("error", onItemError);
            img.addEventListener("load", onItemLoad);
            element.__lazyLoadSrc = img.src = src[lastSrcIndex + 1];
          }
        }
      }
    };
    const markAsError = () => {
      element.classList.add(itemErrorCssClass);
      element.classList.remove(itemLoadedCssClass, itemPendingCssClass, itemLoadingCssClass);
      styleParents(element, options === null || options === void 0 ? void 0 : options.styleParents);
      element.removeEventListener("load", onItemLoad);
      element.removeEventListener("error", onItemError);
      this.intersectionObserver.unobserve(element);
    };
    const onItemError = (_ev) => {
      const target = _ev.target;
      if (target !== element) {
        target.removeEventListener("load", onItemLoad);
        target.removeEventListener("error", onItemError);
      }
      load(true);
    };
    const onItemLoad = (_ev) => {
      const target = _ev.target;
      element.classList.add(itemLoadedCssClass);
      element.classList.remove(itemPendingCssClass, itemLoadingCssClass, itemErrorCssClass);
      styleParents(element, options === null || options === void 0 ? void 0 : options.styleParents);
      this.intersectionObserver.unobserve(element);
      target.removeEventListener("load", onItemLoad);
      target.removeEventListener("error", onItemError);
      element.removeEventListener("load", onItemLoad);
      element.removeEventListener("error", onItemError);
      if (target !== element) {
        element.style.backgroundImage = `url(${target.getAttribute("src")})`;
      }
    };
    if (srcSupported || element.lazyLoad) {
      element.addEventListener("error", onItemError);
      element.addEventListener("load", onItemLoad);
    }
    load(false);
  }
  connectContainer(container) {
    if (!this.containers.includes(container)) {
      this.containers.push(container);
    }
    this.ensureLoaded();
  }
  disconnectContainer(container) {
    const idx = this.containers.indexOf(container);
    if (idx > -1) {
      this.containers.splice(idx, 1);
    }
    if (this.containers.length === 0) {
      this.disconnect();
    }
  }
  ensureLoaded(options) {
    if (options === null || options === void 0 ? void 0 : options.retryError) {
      const errors = this.content.getElementsByClassName(itemErrorCssClass);
      for (let i = 0; i < errors.length; i++) {
        const item = errors[i];
        item.classList.add(itemPendingCssClass);
        item.classList.remove(itemErrorCssClass);
      }
    }
    for (let i = 0; i < this.items.length; i++) {
      this.intersectionObserver.observe(this.items[i]);
    }
    if (!isHydrated(this.content)) {
      waitTillHydrated(this.content, { interval: 100, timeout: 10000 }).then(() => this.ensureLoaded());
    }
  }
  init() {
    this.mutationObserver = new MutationObserver(records => records.find(record => record.addedNodes) && this.ensureLoaded());
    this.mutationObserver.observe(this.content, { subtree: true, childList: true });
    this.intersectionObserver = new IntersectionObserver(entries => this.callback(entries), {
      root: this.content,
      threshold: 0,
    });
    this.items = this.content.getElementsByClassName("ionx-lazy-load-pending");
  }
  disconnect() {
    console.debug("[ionx-lazy-load] disconnect controller");
    this.intersectionObserver.disconnect();
    this.intersectionObserver = undefined;
    this.mutationObserver.disconnect();
    this.mutationObserver = undefined;
    this.content.__ionxLazyLoad = undefined;
    this.content = undefined;
  }
}

function lazyLoadItem(elementOrOptions, options) {
  if (elementOrOptions instanceof HTMLElement) {
    const wasLoaded = elementOrOptions.classList.contains(itemLoadedCssClass) || elementOrOptions.classList.contains(itemLoadingCssClass) || elementOrOptions.classList.contains(itemErrorCssClass);
    elementOrOptions.classList.add(itemPendingCssClass);
    elementOrOptions.classList.remove(itemErrorCssClass, itemLoadingCssClass, itemLoadedCssClass);
    styleParents(elementOrOptions, options === null || options === void 0 ? void 0 : options.styleParents);
    elementOrOptions.__lazyLoadOptions = Object.assign({}, options);
    if (wasLoaded) {
      ensureLazyLoad(elementOrOptions.closest("ion-content"));
    }
  }
  else if (arguments.length === 1) {
    return (element) => lazyLoadItem(element, elementOrOptions);
  }
}

const LazyLoad = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  connectedCallback() {
    this.observer = new MutationObserver(mutations => this.onMutation(mutations));
    this.observer.observe(this.element, { childList: true, subtree: true });
    this.initContent();
  }
  initContent() {
    const content = this.element.closest("ion-content");
    if (!content) {
      setTimeout(() => this.initContent(), 100);
    }
    else {
      if (!content.__ionxLazyLoad) {
        content.__ionxLazyLoad = new LazyLoadController(content);
      }
      content.__ionxLazyLoad.connectContainer(this.element);
    }
  }
  onMutation(_mutations) {
    const content = this.element.closest("ion-content");
    if (content && content.__ionxLazyLoad) {
      content.__ionxLazyLoad.ensureLoaded();
    }
  }
  disconnectedCallback() {
    this.observer.disconnect();
    this.observer = undefined;
    const content = this.element.closest("ion-content");
    if (content && content.__ionxLazyLoad) {
      content.__ionxLazyLoad.disconnectContainer(this.element);
    }
  }
  render() {
    return h(Host, null, h("slot", null));
  }
  get element() { return this; }
};

const IonxLazyLoad = /*@__PURE__*/proxyCustomElement(LazyLoad, [4,"ionx-lazy-load"]);
const defineIonxLazyLoad = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxLazyLoad
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxLazyLoad, LazyLoadController, defineIonxLazyLoad, ensureLazyLoad, lazyLoadItem };
