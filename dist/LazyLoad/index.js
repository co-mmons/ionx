import { HTMLElement as HTMLElement$1, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { Svg } from 'ionx/Svg';
import { isHydrated, waitTillHydrated } from 'ionx/utils';
import { deepEqual } from 'fast-equals';
import { waitTill } from '@co.mmons/js-utils/core';

function ensureLazyLoad(contentOrOptions, options) {
  const contentElements = contentOrOptions instanceof HTMLElement ? [contentOrOptions] : document.body.querySelectorAll("ion-content");
  if (!(contentOrOptions instanceof HTMLElement)) {
    options = contentOrOptions;
  }
  for (let i = 0; i < contentElements.length; i++) {
    if (contentElements[i].__ionxLazyLoad) {
      contentElements[i].__ionxLazyLoad.ensureLoaded({ retryError: options?.retryError });
    }
  }
}

const itemCssClassPrefix = "ionx-lazy-load";
const itemPendingCssClass = `${itemCssClassPrefix}-pending`;
const itemErrorCssClass = `${itemCssClassPrefix}-error`;
const itemLoadingCssClass = `${itemCssClassPrefix}-loading`;
const itemLoadedCssClass = `${itemCssClassPrefix}-loaded`;

function realContainerElement(lazy) {
  if (lazy.container === "parent") {
    if (lazy.parentNode instanceof ShadowRoot) {
      return lazy.parentNode.host;
    }
    return lazy.parentElement;
  }
  else if (lazy.container === "self") {
    return lazy;
  }
}

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
          parent.classList.add(`${prefix}-${state}`);
        }
        else {
          parent.classList.remove(`${prefix}-${state}`);
        }
      }
    }
  }
}

const srcSupportedTagNames = ["IMG", "VIDEO", "IFRAME", Svg.toUpperCase()];
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
    const loadEventName = element.tagName === "VIDEO" ? "loadedmetadata" : "load";
    delete element.__lazyLoadSrc;
    element.classList.remove(itemPendingCssClass);
    element.classList.add(itemLoadingCssClass);
    styleParents(element, options?.styleParents);
    const load = async (afterError) => {
      if (element.lazyLoad) {
        if (!afterError) {
          await element.lazyLoad(options);
        }
        else {
          markAsError();
        }
      }
      else if (options?.src) {
        const srcs = Array.isArray(options.src) ? options.src : [options.src];
        if (srcs.length === 0) {
          console.warn("[ionx-lazy-load] element cannot be lazy loaded, no src given", element);
          markAsError();
        }
        else {
          const lastSrc = (srcSupported && element.getAttribute("src")) || element.__lazyLoadSrc || null;
          const lastSrcIndex = srcs.lastIndexOf(lastSrc);
          if (lastSrcIndex >= srcs.length - 1) {
            markAsError();
          }
          else {
            let src = srcs[lastSrcIndex + 1];
            if (typeof src === "function") {
              try {
                srcs[lastSrcIndex + 1] = src = await src();
              }
              catch (e) {
                srcs.splice(lastSrcIndex + 1, 1);
                onItemError({ target: element, error: e });
                return;
              }
            }
            if (src instanceof Blob) {
              src = URL.createObjectURL(src);
            }
            if (srcSupported) {
              element.setAttribute("src", src);
            }
            else {
              const img = new Image();
              img.addEventListener("error", onItemError);
              img.addEventListener("load", onItemLoad);
              element.__lazyLoadSrc = img.src = src;
            }
          }
        }
      }
    };
    const markAsError = () => {
      element.classList.add(itemErrorCssClass);
      element.classList.remove(itemLoadedCssClass, itemPendingCssClass, itemLoadingCssClass);
      styleParents(element, options?.styleParents);
      element.removeEventListener(loadEventName, onItemLoad);
      element.removeEventListener("error", onItemError);
      this.intersectionObserver.unobserve(element);
    };
    const onItemError = (ev) => {
      console.debug(ev);
      const target = ev.target;
      if (target !== element) {
        target.removeEventListener(loadEventName, onItemLoad);
        target.removeEventListener("error", onItemError);
      }
      load(true);
    };
    const onItemLoad = (_ev) => {
      const target = _ev.target;
      element.classList.add(itemLoadedCssClass);
      element.classList.remove(itemPendingCssClass, itemLoadingCssClass, itemErrorCssClass);
      styleParents(element, options?.styleParents);
      this.intersectionObserver.unobserve(element);
      target.removeEventListener(loadEventName, onItemLoad);
      target.removeEventListener("error", onItemError);
      element.removeEventListener(loadEventName, onItemLoad);
      element.removeEventListener("error", onItemError);
      if (target !== element) {
        element.style.backgroundImage = `url(${target.getAttribute("src")})`;
      }
      const src = target !== element ? target.getAttribute("src") : element.getAttribute("src");
      if (src.startsWith("blob:")) {
        URL.revokeObjectURL(src);
      }
    };
    if (srcSupported || element.lazyLoad) {
      element.addEventListener("error", onItemError);
      element.addEventListener(loadEventName, onItemLoad);
    }
    load(false);
  }
  connectContainer(containerElement) {
    if (!this.containers.find(c => c.element === containerElement)) {
      const element = realContainerElement(containerElement);
      this.containers.push({
        element: containerElement,
        items: element?.getElementsByClassName("ionx-lazy-load-pending"),
        errors: element?.getElementsByClassName(itemErrorCssClass),
        shadowItems: () => containerElement.observeShadow && element.shadowRoot.querySelectorAll(`.${itemPendingCssClass}`),
        shadowErrors: () => containerElement.observeShadow && element.shadowRoot.querySelectorAll(`.${itemErrorCssClass}`)
      });
    }
    this.ensureLoaded();
  }
  disconnectContainer(container) {
    const idx = this.containers.findIndex(c => c.element === container);
    if (idx > -1) {
      this.containers.splice(idx, 1);
    }
    if (this.containers.length === 0) {
      this.disconnect();
    }
  }
  async ensureLoaded(options) {
    if (options?.retryError) {
      for (const errors of [this.errors, ...this.containers.map(c => c.errors), ...this.containers.map(c => c.shadowErrors())]) {
        if (errors) {
          for (let i = 0; i < errors.length; i++) {
            const item = errors[i];
            item.classList.add(itemPendingCssClass);
            item.classList.remove(itemErrorCssClass);
          }
        }
      }
    }
    for (const items of [this.items, ...this.containers.map(c => c.items), ...this.containers.map(c => c.shadowItems())]) {
      if (items) {
        for (let i = 0; i < items.length; i++) {
          this.intersectionObserver.observe(items[i]);
        }
      }
    }
    if (!isHydrated(this.content)) {
      waitTillHydrated(this.content, { interval: 100, timeout: 10000 }).then(() => this.ensureLoaded());
    }
  }
  init() {
    this.intersectionObserver = new IntersectionObserver(entries => this.callback(entries), {
      root: this.content,
      threshold: 0,
    });
    this.mutationObserver = new MutationObserver(records => records.find(record => record.addedNodes) && this.ensureLoaded());
    this.mutationObserver.observe(this.content, { subtree: true, childList: true });
    this.items = this.content.getElementsByClassName(itemPendingCssClass);
    this.errors = this.content.getElementsByClassName(itemErrorCssClass);
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
    const element = elementOrOptions;
    const isLoaded = element.classList.contains(itemLoadedCssClass);
    if (isLoaded && deepEqual(element.__lazyLoadOptions, options)) {
      return;
    }
    const wasLoaded = isLoaded || element.classList.contains(itemLoadingCssClass) || element.classList.contains(itemErrorCssClass);
    element.classList.add(itemPendingCssClass);
    element.classList.remove(itemErrorCssClass, itemLoadingCssClass, itemLoadedCssClass);
    styleParents(element, options?.styleParents);
    element.__lazyLoadOptions = Object.assign({}, options);
    if (wasLoaded) {
      ensureLazyLoad(element.closest("ion-content"));
    }
  }
  else if (arguments.length === 1) {
    return (element) => lazyLoadItem(element, elementOrOptions);
  }
}

const LazyLoad$1 = "ionx-lazy-load";

function closestElement(node, selector) {
  if (!node) {
    return;
  }
  if (node instanceof ShadowRoot) {
    return closestElement(node.host, selector);
  }
  if (node instanceof HTMLElement) {
    if (node.matches(selector)) {
      return node;
    }
    else {
      return closestElement(node.parentNode, selector);
    }
  }
  return closestElement(node.parentNode, selector);
}

let LazyLoad = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
  }
  connectedCallback() {
    this.initContent();
    this.initObservers();
  }
  async initObservers() {
    const container = realContainerElement(this.element);
    if (container) {
      this.observers = [new MutationObserver(mutations => this.onMutation(mutations))];
      this.observers[0].observe(container, { childList: true, subtree: true });
      if (this.observeShadow) {
        await waitTill(() => !!container.shadowRoot);
        this.observers.push(new MutationObserver(mutations => this.onMutation(mutations)));
        this.observers[1].observe(container.shadowRoot, { childList: true, subtree: true });
      }
    }
  }
  initContent() {
    const content = closestElement(this.element, "ion-content");
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
    const content = closestElement(this.element, "ion-content");
    if (content && content.__ionxLazyLoad) {
      content.__ionxLazyLoad.ensureLoaded();
    }
  }
  disconnectedCallback() {
    if (this.observers) {
      for (const observer of this.observers.splice(0, this.observers.length)) {
        observer.disconnect();
      }
    }
    const content = closestElement(this.element, "ion-content");
    if (content && content.__ionxLazyLoad) {
      content.__ionxLazyLoad.disconnectContainer(this.element);
    }
  }
  render() {
    return h(Host, null, h("slot", null));
  }
  get element() { return this; }
};

const IonxLazyLoad = /*@__PURE__*/proxyCustomElement(LazyLoad, [4,"ionx-lazy-load",{"container":[1],"observeShadow":[4,"observe-shadow"]}]);
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
defineIonxLazyLoad();

export { IonxLazyLoad, LazyLoad$1 as LazyLoad, LazyLoadController, defineIonxLazyLoad, ensureLazyLoad, lazyLoadItem };
