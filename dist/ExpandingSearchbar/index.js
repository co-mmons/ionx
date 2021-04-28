import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { addEventListener } from 'ionx/utils';

const expandingSearchbarCss = ".sc-ionx-expanding-searchbar-h.sc-ionx-expanding-searchbar-s>ion-searchbar{position:absolute;top:0px;left:0px;width:0px;overflow:hidden;padding:0px;margin:0px;display:none}.sc-ionx-expanding-searchbar-h.sc-ionx-expanding-searchbar-s>ion-searchbar:not(.searchbar-show-cancel) .searchbar-clear-button{display:block !important}.sc-ionx-expanding-searchbar-h[expanded].sc-ionx-expanding-searchbar-s>ion-searchbar{display:flex;width:100%}.sc-ionx-expanding-searchbar-hion-toolbar.sc-ionx-expanding-searchbar-s>ion-searchbar,ion-toolbar .sc-ionx-expanding-searchbar-h.sc-ionx-expanding-searchbar-s>ion-searchbar{height:100%}.sc-ionx-expanding-searchbar-hion-toolbar[expanded].sc-ionx-expanding-searchbar-s>ion-searchbar,ion-toolbar .sc-ionx-expanding-searchbar-h[expanded].sc-ionx-expanding-searchbar-s>ion-searchbar{padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);padding-left:16px;padding-right:16px}.sc-ionx-expanding-searchbar-hion-toolbar.ios[expanded].sc-ionx-expanding-searchbar-s>ion-searchbar,ion-toolbar.ios .sc-ionx-expanding-searchbar-h[expanded].sc-ionx-expanding-searchbar-s>ion-searchbar{padding-right:calc(var(--padding-start) + 8px);padding-left:calc(var(--padding-end) + 8px)}.sc-ionx-expanding-searchbar-hion-toolbar.md[expanded].sc-ionx-expanding-searchbar-s>ion-searchbar,ion-toolbar.md .sc-ionx-expanding-searchbar-h[expanded].sc-ionx-expanding-searchbar-s>ion-searchbar{padding-right:var(--padding-start);padding-left:var(--padding-end)}";

const ExpandingSearchbar = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  async expand() {
    this.expanded = true;
  }
  onExpand() {
    this.applyState();
  }
  get searchbar() {
    return this.element.querySelector("ion-searchbar");
  }
  collapseIfPossible(cleared) {
    if (this.expanded && (cleared || !this.searchbar.value)) {
      this.expanded = false;
    }
  }
  applyState() {
    if (this.expanded) {
      this.element.parentElement.setAttribute("ionx-expanding-searchbar-parent", "");
      setTimeout(() => this.searchbar.querySelector("input").focus(), 50);
    }
    else {
      this.element.parentElement.removeAttribute("ionx-expanding-searchbar-parent");
      setTimeout(() => this.searchbar.querySelector("input").blur(), 50);
    }
  }
  componentWillLoad() {
    this.applyState();
  }
  connectedCallback() {
    this.onClearUnlisten = addEventListener(this.searchbar, "ionClear", () => this.collapseIfPossible(true));
  }
  disconnectedCallback() {
    var _a;
    (_a = this.onClearUnlisten) === null || _a === void 0 ? void 0 : _a.call(this);
  }
  render() {
    return h(Host, null, h("ionx-expanding-searchbar-parent", null), h("slot", null));
  }
  get element() { return this; }
  static get watchers() { return {
    "expanded": ["onExpand"]
  }; }
  static get style() { return expandingSearchbarCss; }
};

const expandingSearchbarParentCss = "[ionx-expanding-searchbar-parent]>*:not(ionx-expanding-searchbar){visibility:hidden !important;transition:none}";

const ExpandingSearchbarParent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(Host, { style: { display: "none" } });
  }
  static get style() { return expandingSearchbarParentCss; }
};

const IonxExpandingSearchbar = /*@__PURE__*/proxyCustomElement(ExpandingSearchbar, [6,"ionx-expanding-searchbar",{"expanded":[516]}]);
const IonxExpandingSearchbarParent = /*@__PURE__*/proxyCustomElement(ExpandingSearchbarParent, [0,"ionx-expanding-searchbar-parent"]);
const defineIonxExpandingSearchbar = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxExpandingSearchbar,
  IonxExpandingSearchbarParent
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxExpandingSearchbar, IonxExpandingSearchbarParent, defineIonxExpandingSearchbar };
