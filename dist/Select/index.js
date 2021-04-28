import { createEvent, h, Host, Fragment, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { popoverController, modalController, isPlatform } from '@ionic/core';
import { deepEqual } from 'fast-equals';
import { MessageRef, intl } from '@co.mmons/js-intl';
import dragula from 'dragula';
import { Capacitor } from '@capacitor/core';
import { sleep } from '@co.mmons/js-utils/core';
import { matchesMediaBreakpoint } from 'ionx/utils';

const indexAttribute = "__ionx-select-idx";

function isEqualValue(a, b, comparator) {
  if (comparator === "toString") {
    if (a !== undefined && a !== null && b !== undefined && b !== null) {
      return a.toString() === b.toString();
    }
    else {
      return a == b;
    }
  }
  else if (comparator === "deepEqual") {
    return deepEqual(a, b);
  }
  else if (comparator) {
    const r = this.comparator(a, b);
    return r === 0 || r === true;
  }
  return a === b;
}

function valueLabel(options, value, props) {
  if (!options) {
    return;
  }
  for (let i = 0; i < options.length; i++) {
    if (isEqualValue(value, options[i].value, props.comparator)) {
      if (options[i].label) {
        return options[i].label instanceof MessageRef ? intl.message(options[i].label) : options[i].label;
      }
      return props.formatter ? props.formatter(value) : `${value}`;
    }
  }
  return props.formatter ? props.formatter(value) : `${value}`;
}

const selectCss = ".sc-ionx-select-h{--select-placeholder-opacity:.5;--select-dropdown-icon-opacity:.5;--select-disabled-opacity:.5;padding:var(--select-padding-top, 0px) var(--select-padding-end, 0px) var(--select-padding-bottom, 0px) var(--select-padding-start, 0px);display:inline-block;overflow:hidden;color:var(--color);font-family:var(--ion-font-family, inherit);max-width:100%;outline:none;cursor:pointer}.sc-ionx-select-h::-moz-focus-inner{border:0}.sc-ionx-select-h .ionx--inner.sc-ionx-select{display:flex;position:relative}.sc-ionx-select-h .ionx--icon.sc-ionx-select{position:relative;width:16px;height:20px}.sc-ionx-select-h .ionx--icon.sc-ionx-select .ionx--icon-inner.sc-ionx-select{top:50%;right:0px;margin-top:-3px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;opacity:var(--select-dropdown-icon-opacity, 0.5);pointer-events:none}.sc-ionx-select-h .ionx--text.sc-ionx-select{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sc-ionx-select-h .ionx--text.ionx--placeholder-visible.sc-ionx-select{opacity:var(--select-placeholder-opacity, 0.5)}.ionx--disabled.sc-ionx-select-h{opacity:var(--select-disabled-opacity, 0.5);pointer-events:none}.ionx--readonly.sc-ionx-select-h{opacity:1;pointer-events:none}.ionx--readonly.sc-ionx-select-h .select-icon.sc-ionx-select{display:none}[white-space-normal].sc-ionx-select-h .ionx--text.sc-ionx-select,[ionx--white-space=normal].sc-ionx-select-h .ionx--text.sc-ionx-select{white-space:normal !important;overflow:auto}.in-item.sc-ionx-select-h{position:static}.sc-ionx-select-h ion-chip.sc-ionx-select{max-width:calc(100% - 4px);margin:4px 4px 0px 0px}.sc-ionx-select-h ion-chip[__ionx-select-idx].sc-ionx-select{cursor:default}.sc-ionx-select-h ion-chip[__ionx-select-idx].sc-ionx-select>span.sc-ionx-select{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;line-height:1.1}.ionx--orderable.sc-ionx-select-h{cursor:initial}.ionx--orderable.sc-ionx-select-h ion-chip[__ionx-select-idx].sc-ionx-select{cursor:move}.ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select{white-space:normal;overflow:auto;width:100%}ion-toolbar.sc-ionx-select-h,ion-toolbar .sc-ionx-select-h{color:var(--ion-toolbar-color);--icon-color:var(--ion-toolbar-color);--select-padding-start:16px;--select-padding-end:16px}ionx-form-field.sc-ionx-select-h,ionx-form-field .sc-ionx-select-h,.item-label-stacked.sc-ionx-select-h,.item-label-stacked .sc-ionx-select-h{align-self:flex-start;--select-padding-top:8px;--select-padding-bottom:8px;--select-padding-start:0px}ionx-form-field.sc-ionx-select-h .ionx--text.sc-ionx-select,ionx-form-field .sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked.sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked .sc-ionx-select-h .ionx--text.sc-ionx-select{max-width:calc(100% - 16px);flex:initial}ionx-form-field.ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select,ionx-form-field .ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked.ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked .ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select{flex:1}[slot-container=default]>.sc-ionx-select-h,.item-label-stacked.sc-ionx-select-h,.item-label-stacked .sc-ionx-select-h{width:100%}ionx-form-field.sc-ionx-select-h,ionx-form-field .sc-ionx-select-h{--select-padding-start:16px;--select-padding-end:16px}";

const Select = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionFocus = createEvent(this, "ionFocus", 7);
    this.ionStyle = createEvent(this, "ionStyle", 7);
    this.empty = true;
    this.readonly = false;
    this.disabled = false;
    this.separator = ", ";
    this.values = [];
  }
  disabledChanged() {
    this.emitStyle();
  }
  valueChanged(niu) {
    if (!this.valueChangeSilent) {
      this.changeValues(Array.isArray(niu) ? niu : (niu === undefined || niu === null ? [] : [niu]));
    }
    this.valueChangeSilent = false;
  }
  changeValues(values) {
    if (!deepEqual(this.values, values)) {
      this.values = values.slice();
      this.valueChangeSilent = true;
      this.value = this.multiple ? values.slice() : (this.values.length > 0 ? this.values[0] : undefined);
      this.emitStyle();
    }
  }
  async setFocus(options) {
    this.element.focus(options);
  }
  async setBlur() {
    this.element.blur();
  }
  onFocus() {
    this.focused = true;
    this.emitStyle();
  }
  onBlur() {
    this.focused = false;
    this.emitStyle();
  }
  emitStyle() {
    this.ionStyle.emit({
      "interactive": !this.disabled && !this.readonly,
      "input": true,
      "has-placeholder": this.placeholder != null,
      "has-value": this.values.length > 0,
      "has-focus": this.focused,
      "interactive-disabled": this.disabled,
    });
  }
  async open() {
    const overlay = this.overlay || "popover";
    let overlayTitle;
    if (this.overlayTitle) {
      overlayTitle = this.overlayTitle;
    }
    if (!overlayTitle) {
      const ionItem = this.element.closest("ion-item");
      if (ionItem) {
        const titleElement = ionItem.querySelector("ionx-select-title");
        if (titleElement) {
          overlayTitle = titleElement.innerText;
        }
        else {
          const label = ionItem.querySelector("ion-label");
          if (label) {
            overlayTitle = label.innerText;
          }
        }
      }
    }
    if (!overlayTitle && this.element.title) {
      overlayTitle = this.element.title;
    }
    if (!overlayTitle && this.placeholder) {
      overlayTitle = this.placeholder;
    }
    const overlayData = {
      overlay,
      options: this.options,
      values: this.values.slice(),
      multiple: !!this.multiple,
      overlayTitle: overlayTitle,
      comparator: this.comparator,
      labelFormatter: this.labelFormatter,
      orderable: !!this.orderable,
      empty: !!this.empty,
      searchTest: this.searchTest,
      // whiteSpace: this.overlayWhiteSpace,
      checkValidator: this.checkValidator
    };
    let result;
    let didDismiss;
    if (overlay === "popover") {
      const popover = await popoverController.create({ component: "ionx-select-overlay", componentProps: overlayData, event: { target: this.element } });
      popover.present();
      result = await popover.onWillDismiss();
      didDismiss = popover.onDidDismiss();
    }
    else {
      const modal = await modalController.create({ component: "ionx-select-overlay", componentProps: overlayData });
      modal.present();
      result = await modal.onWillDismiss();
      didDismiss = modal.onDidDismiss();
    }
    if (result.role === "ok") {
      this.changeValues(result.data);
      this.ionChange.emit({ value: this.value });
    }
    await didDismiss;
    this.setFocus();
  }
  connectedCallback() {
    this.valueChanged(this.value);
    if (!this.element.hasAttribute("tabIndex")) {
      this.element.setAttribute("tabIndex", "0");
    }
  }
  render() {
    const LabelComponent = this.labelComponent;
    const ValueComponent = this.orderable ? "ion-chip" : "span";
    const length = this.values.length;
    // currently processed option whose value is selected
    let currentOption;
    let currentLabel;
    return h(Host, { role: "combobox", "aria-haspopup": "dialog", class: {
        "ionx--orderable": this.orderable && !this.disabled && !this.readonly,
        "ionx--readonly": !!this.readonly,
        "ionx--disabled": !!this.disabled
      }, onClick: () => this.open() }, this.orderable && h("ionx-select-orderable", { enabled: !this.readonly && !this.disabled, values: this.values, onOrderChanged: ev => this.values = ev.detail }), h("div", { class: "ionx--inner" }, h("div", { class: {
        "ionx--text": true,
        "ionx--placeholder-visible": length === 0 && !!this.placeholder
      } }, length === 0 && this.placeholder && h("span", null, this.placeholder), this.values.map((value, index) => {
      var _a;
      return h(Fragment, null, (currentOption = (_a = this.options) === null || _a === void 0 ? void 0 : _a.find(option => isEqualValue(value, option.value, this.comparator))) && h(Fragment, null), (currentLabel = valueLabel(this.options, value, { comparator: this.comparator, formatter: this.labelFormatter })) && h(Fragment, null), h(ValueComponent, Object.assign({ key: value, outline: true }, { [indexAttribute]: index }), !!LabelComponent ? h(LabelComponent, { value: value, option: currentOption, label: currentLabel, index: index, readonly: this.readonly }) :
        h("span", null, currentLabel, !this.orderable && index < length - 1 ? this.separator : "")), !this.readonly && !this.disabled && this.multiple && this.orderable && index === length - 1 && h("ion-chip", { onClick: () => this.open() }, h("ion-icon", { name: "ellipsis-horizontal", style: { margin: "0px" } })));
    })), !this.readonly && !this.disabled && h(Fragment, null, !this.orderable && h("div", { class: "ionx--icon", role: "presentation" }, h("div", { class: "ionx--icon-inner" })))));
  }
  get element() { return this; }
  static get watchers() { return {
    "disabled": ["disabledChanged"],
    "value": ["valueChanged"]
  }; }
  static get style() { return selectCss; }
};

const selectOrderableCss = ".gu-mirror{position:fixed !important;margin:0 !important;z-index:9999 !important;opacity:0.8;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=80)\";filter:alpha(opacity=80)}.gu-hide{display:none !important}.gu-unselectable{-webkit-user-select:none !important;-moz-user-select:none !important;-ms-user-select:none !important;user-select:none !important}.gu-transit{opacity:0.2;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=20)\";filter:alpha(opacity=20)}:host{display:none}";

const SelectOrderable = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.orderChanged = createEvent(this, "orderChanged", 3);
  }
  async watchEnabled() {
    if (this.enabled) {
      if (this.instance) {
        return;
      }
      this.instance = dragula({
        containers: [this.element.parentElement.querySelector(".ionx--text")],
        // mirrorContainer: document.querySelector("ion-app"),
        direction: "horizontal",
        moves: (el) => {
          if (!el.hasAttribute(indexAttribute)) {
            return false;
          }
          return this.values && this.values.length > 1;
        },
        accepts: (_el, _target, _source, _sibling) => {
          return !!_sibling;
        }
      });
      this.instance.on("drop", (el, _target, _source, sibling) => {
        const startIndex = parseInt(el.getAttribute(indexAttribute), 10);
        let endIndex = sibling ? parseInt(sibling.getAttribute(indexAttribute), 10) : this.values.length;
        if (endIndex > startIndex) {
          endIndex -= 1;
        }
        const values = this.values.slice();
        const element = values[startIndex];
        values.splice(startIndex, 1);
        values.splice(endIndex, 0, element);
        this.orderChanged.emit(values);
      });
    }
    else if (this.instance) {
      this.instance.destroy();
      this.instance = undefined;
    }
  }
  connectedCallback() {
    this.watchEnabled();
  }
  disconnectedCallback() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = undefined;
    }
  }
  get element() { return this; }
  static get watchers() { return {
    "enabled": ["watchEnabled"]
  }; }
  static get style() { return selectOrderableCss; }
};

const selectOverlayCss = ".sc-ionx-select-overlay-h{display:block}.sc-ionx-select-overlay-h ion-list.sc-ionx-select-overlay{margin:4px 0px;padding:0px}.sc-ionx-select-overlay-h ion-item.sc-ionx-select-overlay:last-child{--border-width:0px}.sc-ionx-select-overlay-h ion-checkbox.sc-ionx-select-overlay{margin-right:16px;margin-left:0px}ion-popover.sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay{--overflow:initial !important;height:auto !important;contain:content}ion-popover.sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay ion-item.sc-ionx-select-overlay ion-label.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay ion-item.sc-ionx-select-overlay ion-label.sc-ionx-select-overlay{white-space:normal}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay{position:sticky;bottom:0px}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-toolbar.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-toolbar.sc-ionx-select-overlay{--padding-start:0px;--padding-end:0px;--padding-top:0px;--padding-bottom:0px;--min-height:none;--ion-safe-area-bottom:0px;--ion-safe-area-top:0px;--ion-safe-area-start:0px;--ion-safe-area-end:0px}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay div.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay div.sc-ionx-select-overlay{flex:1;display:flex}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay{min-height:44px;margin:0px}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:last-child),ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:last-child){font-weight:400}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:last-child,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:last-child{font-weight:500}ion-popover.sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay div.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay div.sc-ionx-select-overlay{justify-content:flex-end}ion-popover.sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay{flex:none !important}ion-popover.sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay{width:50%}ion-popover.sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:first-child),ion-popover .sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:first-child){border-left:var(--ionx-border-width) solid var(--ion-border-color)}";

const SelectOverlay = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.didEnter = false;
  }
  async search(ev) {
    var _a, _b;
    const query = (_b = (_a = ev.detail.value) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) !== null && _b !== void 0 ? _b : undefined;
    if (query) {
      const options = [];
      for (let i = 0; i < this.options.length; i++) {
        if (!this.options[i].divider) {
          const label = (this.options[i].label instanceof MessageRef ? intl.message(this.options[i].label) : this.options[i].label) || (this.labelFormatter ? this.labelFormatter(this.options[i].value) : `${this.options[i].value}`);
          if (this.searchTest) {
            if (!this.searchTest(query, this.options[i].value, label)) {
              continue;
            }
          }
          else if ((label || "").toLowerCase().indexOf(query) < 0) {
            continue;
          }
          // search for parent divider
          for (let ii = i - 1; ii >= 0; ii--) {
            if (this.options[ii].divider) {
              options.push(this.options[ii]);
              break;
            }
          }
          options.push(this.options[i]);
        }
      }
      this.visibleOptions = options;
    }
    else {
      this.visibleOptions = this.options.slice();
    }
  }
  async onDidEnter() {
    if (this.useVirtualScroll) {
      let firstItem;
      while (!firstItem) {
        firstItem = this.element.querySelector(`ion-item[${indexAttribute}]`);
        if (!firstItem) {
          await sleep(1);
        }
      }
      this.virtualItemHeight = firstItem.getBoundingClientRect().height + 1;
    }
    this.didEnter = true;
    const indexToSelect = (this.values.length > 0 && this.options.findIndex(option => this.values.findIndex(v => isEqualValue(option.value, v, this.comparator)) > -1)) || -1;
    if (indexToSelect > -1) {
      this.scrollToIndex(indexToSelect);
    }
    if (this.overlay === "modal" && Capacitor.platform === "web" && isPlatform("desktop")) {
      let searchbar;
      while (!searchbar) {
        searchbar = this.element.querySelector("ion-searchbar");
        if (!searchbar) {
          await sleep(1);
        }
      }
      searchbar.setFocus();
    }
  }
  async scrollToIndex(index) {
    var _a;
    const content = this.element.querySelector("ion-content");
    if (content) {
      const scroll = await content.getScrollElement();
      while (!this.element.querySelector("ion-list ion-item")) {
        await sleep(1);
      }
      if (this.useVirtualScroll) {
        scroll.scrollTo({ top: (index - 1) * this.virtualItemHeight });
      }
      else {
        (_a = this.element.querySelector(`ion-item[${indexAttribute}="${index - 1}"]`)) === null || _a === void 0 ? void 0 : _a.scrollIntoView();
      }
    }
  }
  onClick(ev, option) {
    const wasChecked = this.values.findIndex(value => isEqualValue(value, option.value, this.comparator)) > -1;
    if (!this.empty && this.values.length === 1 && wasChecked) {
      ev.target.checked = true;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      return;
    }
    this.onCheck(option, !wasChecked);
  }
  onCheck(option, checked) {
    const valuesBefore = this.values.slice();
    VALUES: {
      for (let i = 0; i < this.values.length; i++) {
        if (isEqualValue(this.values[i], option.value, this.comparator)) {
          if (!checked) {
            this.values.splice(i, 1);
          }
          else {
            break VALUES;
          }
          break;
        }
      }
      if (checked) {
        if (this.multiple) {
          this.values.push(option.value);
        }
        else {
          this.values = [option.value];
        }
      }
    }
    if (this.multiple && this.checkValidator) {
      this.values = this.checkValidator(option.value, checked, valuesBefore) || [];
    }
    if (!this.multiple) {
      this.ok();
    }
  }
  cancel() {
    if (this.overlay === "modal") {
      const modal = this.element.closest("ion-modal");
      modal.dismiss(undefined, "cancel");
    }
    else {
      const popover = this.element.closest("ion-popover");
      popover.dismiss(undefined, "cancel");
    }
  }
  ok() {
    if (!this.orderable) {
      this.values.sort((a, b) => this.options.findIndex(o => isEqualValue(o.value, a, this.comparator)) - this.options.findIndex(o => isEqualValue(o.value, b, this.comparator)));
    }
    if (this.overlay === "modal") {
      const modal = this.element.closest("ion-modal");
      modal.dismiss(this.values, "ok");
    }
    else {
      const popover = this.element.closest("ion-popover");
      popover.dismiss(this.values, "ok");
    }
  }
  connectedCallback() {
    this.useVirtualScroll = this.overlay === "modal" && this.options.length > 100;
    this.visibleOptions = this.options.slice();
  }
  renderItem(option, index) {
    var _a;
    if (!option) {
      return;
    }
    return h("ion-item", Object.assign({ key: index }, { [indexAttribute]: index }), h("ion-checkbox", { class: "sc-ionx-select-overlay", slot: "start", checked: this.values.findIndex(v => isEqualValue(v, option.value, this.comparator)) > -1, onClick: ev => this.onClick(ev, option) }), h("ion-label", null, (_a = option.label) !== null && _a !== void 0 ? _a : (this.labelFormatter ? this.labelFormatter(option.value) : `${option.value}`)));
  }
  render() {
    return h(Host, null, this.useVirtualScroll && !this.didEnter && h("div", { style: { visibility: "hidden" } }, this.renderItem(this.options.find(o => !o.divider), 0)), this.overlay === "modal" && h("ion-header", null, h("ion-toolbar", null, h("ion-back-button", { style: { display: "inline-block" }, icon: matchesMediaBreakpoint(this, "md") ? "close" : null, onClick: ev => [ev.preventDefault(), this.cancel()], slot: "start" }), h("ion-title", { style: { padding: "0px" } }, this.overlayTitle), h("ion-buttons", { slot: "end" }, h("ion-button", { fill: "clear", onClick: () => this.ok() }, intl.message `@co.mmons/js-intl#Done`))), h("ion-toolbar", null, h("ion-searchbar", { type: "text", autocomplete: "off", placeholder: intl.message `@co.mmons/js-intl#Search`, onIonChange: ev => this.search(ev) }))), h("ion-content", { scrollY: this.overlay === "modal", scrollX: false }, !this.didEnter && this.overlay === "modal" && h("ionx-loading", { type: "spinner", cover: true, slot: "fixed" }), h("ion-list", { lines: "full" }, this.didEnter && this.useVirtualScroll && h("ion-virtual-scroll", { items: this.visibleOptions, approxItemHeight: this.virtualItemHeight, renderItem: (item, index) => this.renderItem(item, index) }), (this.overlay === "popover" || !this.useVirtualScroll) && this.options.map((option, index) => this.renderItem(option, index)))), this.multiple && this.overlay === "popover" && h("ion-footer", null, h("ion-toolbar", null, h("div", null, h("ion-button", { size: "small", fill: "clear", onClick: () => this.cancel() }, intl.message `@co.mmons/js-intl#Cancel`), h("ion-button", { size: "small", fill: "clear", onClick: () => this.ok() }, intl.message `@co.mmons/js-intl#Ok`)))));
  }
  get element() { return this; }
  static get style() { return selectOverlayCss; }
};

const IonxSelect = /*@__PURE__*/proxyCustomElement(Select, [2,"ionx-select",{"placeholder":[1],"overlay":[1],"overlayTitle":[1,"overlay-title"],"overlayOptions":[16],"alwaysArray":[4,"always-array"],"comparator":[1],"multiple":[4],"orderable":[4],"empty":[4],"readonly":[4],"disabled":[4],"searchTest":[16],"checkValidator":[16],"options":[1040],"lazyOptions":[16],"labelComponent":[1,"label-component"],"labelFormatter":[16],"separator":[1],"value":[1032],"values":[32]},[[0,"focus","onFocus"],[0,"blur","onBlur"]]]);
const IonxSelectOrderable = /*@__PURE__*/proxyCustomElement(SelectOrderable, [0,"ionx-select-orderable",{"enabled":[4],"values":[16]}]);
const IonxSelectOverlay = /*@__PURE__*/proxyCustomElement(SelectOverlay, [2,"ionx-select-overlay",{"overlay":[1],"overlayTitle":[1,"overlay-title"],"orderable":[4],"searchTest":[16],"options":[16],"multiple":[4],"values":[1040],"empty":[4],"comparator":[1],"checkValidator":[16],"labelFormatter":[16],"visibleOptions":[32],"didEnter":[32]},[[0,"ionViewDidEnter","onDidEnter"]]]);
const defineIonxSelect = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxSelect,
  IonxSelectOrderable,
  IonxSelectOverlay
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxSelect, IonxSelectOrderable, IonxSelectOverlay, defineIonxSelect };
