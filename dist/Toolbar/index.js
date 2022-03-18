import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { waitTill } from '@co.mmons/js-utils/core';
import { addEventListener, matchesMediaBreakpoint } from 'ionx/utils';
import { WidthBreakpointsContainer } from 'ionx/WidthBreakpoints';

const toolbarCss = ".sc-ionx-toolbar-h{display:block}.sc-ionx-toolbar-h ion-toolbar.sc-ionx-toolbar{--min-height:56px;--padding-top:0px;--padding-bottom:0px;--padding-start:0px;--padding-end:0px;--border-width:0;overflow:hidden}.sc-ionx-toolbar-h ion-back-button.sc-ionx-toolbar,.sc-ionx-toolbar-h ion-menu-button.sc-ionx-toolbar{align-self:flex-start;min-width:48px;height:48px;margin:4px 0}.sc-ionx-toolbar-h .menu-button-hidden.sc-ionx-toolbar+[ionx--inner].sc-ionx-toolbar{margin-left:16px}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar{padding:15px 16px 15px 0;min-height:56px}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{color:var(--ion-toolbar-title-color, var(--color));font-family:var(--ion-toolbar-title-font-family, var(--ion-font-family, inherit));font-weight:var(--ion-toolbar-title-font-weight, 500);font-size:22px;display:block;margin:0;padding:0;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;-webkit-font-smoothing:antialiased;letter-spacing:0}.md .sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{letter-spacing:0.0125em}.ios .sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{font-weight:var(--ion-toolbar-title-font-weight, 600)}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar:empty{display:none}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar ion-buttons.sc-ionx-toolbar{float:right;padding:0;margin:0;position:relative;right:-8px;max-height:26px}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar ion-buttons.sc-ionx-toolbar:empty{display:none}.ionx--title-wrap.sc-ionx-toolbar-h:not(.ionx--title-collapsed) [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{display:inline;white-space:normal;text-overflow:initial;overflow:auto}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[ionx--inner] ion-button{margin-left:0;margin-right:0;--padding-start:4px;--padding-end:4px}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[slot=title]{line-height:1.1}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[slot=subtitle]{font-size:75%;font-weight:400}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[slot=subtitle]::before{content:\"\\a\";white-space:pre}.header-ios.sc-ionx-toolbar-h:last-child ion-toolbar.sc-ionx-toolbar,.header-ios .sc-ionx-toolbar-h:last-child ion-toolbar.sc-ionx-toolbar{--border-width:0 0 0.55px}";

let Toolbar = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.titleWrap = false;
  }
  titleWrapChanged(niu, old) {
    if (niu !== old) {
      if (niu !== "collapse") {
        this.disableCollapsibleTitle();
      }
      else {
        this.enableCollapsibleTitle();
      }
    }
  }
  get contentElement() {
    return this.element.closest("ion-header")?.parentElement?.querySelector("ion-content");
  }
  async contentScrolled(scrollElement) {
    if (!scrollElement) {
      scrollElement = await this.contentElement?.getScrollElement();
    }
    if (!scrollElement) {
      this.disableCollapsibleTitle();
      return;
    }
    if (!this.toolbarElement) {
      return;
    }
    const toolbarHeight = 56;
    const scrollTop = scrollElement.scrollTop;
    if (scrollTop < 100) {
      this.toolbarElement.style.maxHeight = null;
      this.element.classList.remove("ionx--title-collapsed");
    }
    else if (scrollTop > 100 + toolbarHeight) {
      this.toolbarElement.style.maxHeight = `${toolbarHeight}px`;
      this.element.classList.add("ionx--title-collapsed");
    }
    else {
      this.element.classList.remove("ionx--title-collapsed");
      this.toolbarElement.style.maxHeight = `${(toolbarHeight * 2) + 100 - scrollTop}px`;
    }
  }
  async enableCollapsibleTitle() {
    if (!this.unlistenScroll) {
      let content;
      try {
        await waitTill(() => !!(content = this.contentElement), undefined, 10000);
      }
      catch {
      }
      if (content) {
        content.scrollEvents = true;
        this.unlistenScroll = addEventListener(content, "ionScroll", (ev) => this.contentScrolled((ev.detail.event.target || ev.detail.event.path?.[0])));
        this.contentScrolled(await content.getScrollElement());
      }
    }
  }
  disableCollapsibleTitle() {
    if (this.unlistenScroll) {
      this.unlistenScroll();
      this.unlistenScroll = undefined;
      if (this.toolbarElement) {
        this.toolbarElement.style.maxHeight = null;
      }
      this.element.classList.remove("ionx--title-collapsed");
    }
  }
  dismissOverlay() {
    const modal = this.element.closest("ion-modal");
    if (modal) {
      modal.dismiss();
      return;
    }
    const popover = this.element.closest("ion-popover");
    if (popover) {
      popover.dismiss();
      return;
    }
  }
  connectedCallback() {
    this.breakpoints = new WidthBreakpointsContainer(this.element);
    if (this.titleWrap === "collapse") {
      this.enableCollapsibleTitle();
    }
  }
  disconnectedCallback() {
    this.disableCollapsibleTitle();
    this.toolbarElement = undefined;
    this.breakpoints.disconnect();
    this.breakpoints = undefined;
  }
  render() {
    const closeIcon = this.button === "close" && matchesMediaBreakpoint(this, "md") ? "close" : undefined;
    return h(Host, { class: { "ionx--title-wrap": typeof this.titleWrap === "boolean" ? this.titleWrap : this.titleWrap === "collapse" } }, h("ion-toolbar", { ref: el => this.toolbarElement = el }, this.button === "menu" && h("ion-menu-button", { slot: "start" }), (this.button === "back" || this.button === "close") && h("ion-back-button", { slot: "start", style: { display: closeIcon ? "inline-block" : null }, icon: closeIcon ? "close" : undefined, onClick: ev => this.button === "close" && [ev.preventDefault(), this.buttonHandler ? this.buttonHandler() : this.dismissOverlay()], defaultHref: (this.button === "back" && this.defaultBackHref) || null }), h("div", { "ionx--inner": true }, h("ion-buttons", null, h("slot", { name: "action" })), h("h1", null, h("slot", { name: "title" }), h("slot", { name: "subtitle" }))), h("slot", null)));
  }
  get element() { return this; }
  static get watchers() { return {
    "titleWrap": ["titleWrapChanged"]
  }; }
  static get style() { return toolbarCss; }
};

const IonxToolbar = /*@__PURE__*/proxyCustomElement(Toolbar, [6,"ionx-toolbar",{"button":[1],"buttonIcon":[1,"button-icon"],"buttonHandler":[16],"defaultBackHref":[1,"default-back-href"],"titleWrap":[8,"title-wrap"]}]);
const defineIonxToolbar = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxToolbar
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxToolbar, defineIonxToolbar };
