import { HTMLElement, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { waitTill } from '@co.mmons/js-utils/core';
import { getMode } from '@ionic/core';
import { openUrl } from 'ionx/Router';
import { addEventListener } from 'ionx/utils';
import { WidthBreakpointsContainer } from 'ionx/WidthBreakpoints';

const Toolbar$1 = "ionx-toolbar";

const toolbarCss = ".sc-ionx-toolbar-h{display:block}.sc-ionx-toolbar-h ion-toolbar.sc-ionx-toolbar{overflow:hidden;--min-height:56px;--padding-top:0px;--padding-bottom:0px;--padding-start:0px;--padding-end:0px;--border-width:0;--background:var(--toolbar-background-color, var(--app-toolbar-background-color));--color:var(--toolbar-foreground-color, var(--app-toolbar-foreground-color, var(--app-toolbar-background-color-contrast)));--border-color:var(--toolbar-border-color, var(--app-toolbar-border-color, var(--ionx-toolbar-border-color, var(--ion-toolbar-border-color, var(--ion-border-color, var(--ion-color-step-150, rgba(0, 0, 0, 0.2)))))))}.sc-ionx-toolbar-h ion-back-button.sc-ionx-toolbar,.sc-ionx-toolbar-h ion-menu-button.sc-ionx-toolbar,.sc-ionx-toolbar-h .back-close-button.sc-ionx-toolbar{align-self:flex-start;min-width:48px;height:48px;margin:4px 0;--border-radius:48px;--padding-start:0;--padding-end:0;--color:var(--app-primary-color, var(--ion-color-primary))}.sc-ionx-toolbar-h .menu-button-hidden.sc-ionx-toolbar+[ionx--inner].sc-ionx-toolbar{margin-left:16px}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar{padding:14.8px 16px 14.8px 0;min-height:56px}.sc-ionx-toolbar-h [ionx--inner].ionx--no-button.sc-ionx-toolbar{padding:15px 16px}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{color:var(--toolbar-heading-color, var(--toolbar-foreground-color, var(--app-toolbar-heading-color, var(--app-toolbar-foreground-color, var(--app-toolbar-background-color-contrast)))));font-family:var(--toolbar-heading-font-family, var(--app-toolbar-heading-font-family, var(--ionx-toolbar-title-font-family, var(--ion-toolbar-title-font-family, var(--ion-font-family, inherit)))));font-weight:var(--toolbar-heading-font-weight, var(--app-toolbar-heading-font-weight, var(--ionx-toolbar-title-font-weight, var(--ion-toolbar-title-font-weight, 500))));font-size:var(--toolbar-heading-font-size, var(--app-toolbar-heading-font-size, var(--ionx-toolbar-title-font-size, var(--ion-toolbar-title-font-size, 22px))));display:block;margin:0;padding:0;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;-webkit-font-smoothing:antialiased;letter-spacing:0;line-height:1.2}.md .sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{letter-spacing:0.0125em}.ios .sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{font-weight:var(--toolbar-heading-font-weight, var(--app-toolbar-heading-font-weight, var(--ionx-toolbar-title-font-weight, var(--ion-toolbar-title-font-weight, 600))))}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar:empty{display:none}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar ion-buttons.sc-ionx-toolbar{float:right;padding:0;margin:0;position:relative;max-height:26px}.sc-ionx-toolbar-h [ionx--inner].sc-ionx-toolbar ion-buttons.sc-ionx-toolbar:empty{display:none}.ionx--title-wrap.sc-ionx-toolbar-h:not(.ionx--title-collapsed) [ionx--inner].sc-ionx-toolbar h1.sc-ionx-toolbar{display:inline;white-space:normal;text-overflow:initial;overflow:auto}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[ionx--inner] ion-button{margin-left:0;margin-right:0;--padding-start:4px;--padding-end:4px}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[slot=title]{line-height:1.1}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[slot=subtitle]{font-size:75%;font-weight:400}.sc-ionx-toolbar-h .sc-ionx-toolbar-s>[slot=subtitle]::before{content:\"\\a\";white-space:pre}.header-ios.sc-ionx-toolbar-h:last-child ion-toolbar.sc-ionx-toolbar,.header-ios .sc-ionx-toolbar-h:last-child ion-toolbar.sc-ionx-toolbar{--border-width:0}";

let Toolbar = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.titleVisible = true;
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
  async buttonClicked(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.button === "close") {
      if (this.buttonHandler) {
        this.buttonHandler();
      }
      this.dismissOverlay();
    }
    else if (this.button === "back") {
      const nav = this.element.closest("ion-nav");
      if (nav && await nav.canGoBack()) {
        const router = document.querySelector("ion-router");
        if (router && !nav.closest("[no-router]")) {
          const canTransition = await router.canTransition();
          if (canTransition === true) {
            return await router.back();
          }
        }
        return nav.pop({ skipIfBusy: true });
      }
      return openUrl(this.defaultBackHref, "back");
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
    const mode = getMode();
    return h(Host, { class: { "ionx--title-wrap": typeof this.titleWrap === "boolean" ? this.titleWrap : this.titleWrap === "collapse" } }, h("ion-toolbar", { ref: el => this.toolbarElement = el }, this.button === "menu" && h("ion-menu-button", { slot: "start" }), (this.button === "back" || this.button === "close") && h("ion-button", { class: "back-close-button", slot: "start", fill: "clear", onClick: ev => this.buttonClicked(ev) }, h("ion-icon", { name: this.button === "close" ? "close" : (mode === "ios" ? "chevron-back" : "arrow-back"), slot: "icon-only" })), h("div", { "ionx--inner": true, class: { "ionx--no-button": this.button === "none" } }, h("ion-buttons", null, h("slot", { name: "action" })), h("h1", { style: { display: this.titleVisible ? null : "none" } }, h("slot", { name: "title" }), h("slot", { name: "subtitle" }))), h("slot", null)));
  }
  get element() { return this; }
  static get watchers() { return {
    "titleWrap": ["titleWrapChanged"]
  }; }
  static get style() { return toolbarCss; }
};

const IonxToolbar = /*@__PURE__*/proxyCustomElement(Toolbar, [6,"ionx-toolbar",{"button":[1],"buttonIcon":[1,"button-icon"],"buttonHandler":[16],"defaultBackHref":[1,"default-back-href"],"titleVisible":[4,"title-visible"],"titleWrap":[8,"title-wrap"]}]);
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
defineIonxToolbar();

export { IonxToolbar, Toolbar$1 as Toolbar, defineIonxToolbar };
