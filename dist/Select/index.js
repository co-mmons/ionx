import { createEvent, forceUpdate, h, Fragment, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { popoverController, modalController, isPlatform } from '@ionic/core';
import { deepEqual } from 'fast-equals';
import { MessageRef, intl } from '@co.mmons/js-intl';
import { Capacitor } from '@capacitor/core';
import { sleep, waitTill } from '@co.mmons/js-utils/core';
import { defineIonxLoading } from 'ionx/Loading';
import { defineIonxToolbar } from 'ionx/Toolbar';
import { waitTillHydrated } from 'ionx/utils';

async function showSelectOverlay(overlay, event) {
  let willDismiss;
  let didDismiss;
  if (overlay.overlay === "popover") {
    const popover = await popoverController.create({ component: "ionx-select-overlay", componentProps: overlay, event });
    popover.present();
    willDismiss = popover.onWillDismiss();
    didDismiss = popover.onDidDismiss();
  }
  else {
    const modal = await modalController.create({ component: "ionx-select-overlay", componentProps: overlay });
    modal.present();
    willDismiss = modal.onWillDismiss();
    didDismiss = modal.onDidDismiss();
  }
  return { willDismiss, didDismiss };
}

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

function findValueItem(items, value, comparator) {
  if (items) {
    for (const item of items) {
      if ("value" in item && isEqualValue(item.value, value, comparator)) {
        return item;
      }
    }
  }
}

const sortableItemClass = "ionx-select-sortable";

function valueLabel(items, value, props) {
  if (!items) {
    return;
  }
  for (let i = 0; i < items.length; i++) {
    if (isEqualValue(value, items[i].value, props.comparator)) {
      if (items[i].label) {
        return items[i].label instanceof MessageRef ? intl.message(items[i].label) : items[i].label;
      }
      return props.formatter ? props.formatter(value) : `${value}`;
    }
  }
  return props.formatter ? props.formatter(value) : `${value}`;
}

const selectCss = ".sc-ionx-select-h{--select-placeholder-opacity:.5;--select-dropdown-icon-opacity:.5;--select-disabled-opacity:.5;padding:var(--select-padding-top, 0px) var(--select-padding-end, 0px) var(--select-padding-bottom, 0px) var(--select-padding-start, 0px);display:inline-block;overflow:hidden;color:var(--color);font-family:var(--ion-font-family, inherit);max-width:100%;outline:none;cursor:pointer}.sc-ionx-select-h::-moz-focus-inner{border:0}.sc-ionx-select-h .ionx--inner.sc-ionx-select{display:flex;position:relative}.sc-ionx-select-h .ionx--icon.sc-ionx-select{position:relative;width:16px;height:20px}.sc-ionx-select-h .ionx--icon.sc-ionx-select .ionx--icon-inner.sc-ionx-select{top:50%;right:0px;margin-top:-3px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;opacity:var(--select-dropdown-icon-opacity, 0.5);pointer-events:none}.sc-ionx-select-h .ionx--text.sc-ionx-select{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sc-ionx-select-h .ionx--text.ionx--placeholder-visible.sc-ionx-select{opacity:var(--select-placeholder-opacity, 0.5)}.ionx--disabled.sc-ionx-select-h{opacity:var(--select-disabled-opacity, 0.5);pointer-events:none}.ionx--readonly.sc-ionx-select-h{opacity:1;pointer-events:none}.ionx--readonly.sc-ionx-select-h .select-icon.sc-ionx-select{display:none}[white-space-normal].sc-ionx-select-h .ionx--text.sc-ionx-select,[ionx--white-space=normal].sc-ionx-select-h .ionx--text.sc-ionx-select{white-space:normal !important;overflow:auto}.in-item.sc-ionx-select-h{position:static}.sc-ionx-select-h ion-chip.sc-ionx-select{max-width:calc(100% - 4px);margin:4px 4px 0px 0px}.sc-ionx-select-h ion-chip.ionx-select-sortable.sc-ionx-select{cursor:default}.sc-ionx-select-h ion-chip.ionx-select-sortable.sc-ionx-select>span.sc-ionx-select{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;line-height:1.1}.ionx--sortable.sc-ionx-select-h{cursor:initial}.ionx--sortable.sc-ionx-select-h .ionx-select-sortable.sc-ionx-select{cursor:move}.ionx--sortable.sc-ionx-select-h .ionx--text.sc-ionx-select{white-space:normal;overflow:auto;width:100%}ion-toolbar.sc-ionx-select-h,ion-toolbar .sc-ionx-select-h{color:var(--ion-toolbar-color);--icon-color:var(--ion-toolbar-color);--select-padding-start:16px;--select-padding-end:16px}ionx-form-field.sc-ionx-select-h,ionx-form-field .sc-ionx-select-h,.item-label-stacked.sc-ionx-select-h,.item-label-stacked .sc-ionx-select-h{align-self:flex-start;--select-padding-top:8px;--select-padding-bottom:8px;--select-padding-start:0px}ionx-form-field.sc-ionx-select-h .ionx--text.sc-ionx-select,ionx-form-field .sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked.sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked .sc-ionx-select-h .ionx--text.sc-ionx-select{max-width:calc(100% - 16px);flex:initial}ionx-form-field.ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select,ionx-form-field .ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked.ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select,.item-label-stacked .ionx--orderable.sc-ionx-select-h .ionx--text.sc-ionx-select{flex:1}[slot-container=default]>.sc-ionx-select-h,.item-label-stacked.sc-ionx-select-h,.item-label-stacked .sc-ionx-select-h{width:100%}ionx-form-field.sc-ionx-select-h,ionx-form-field .sc-ionx-select-h{--select-padding-start:16px;--select-padding-end:16px}";

let instanceCounter = 0;
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
    this.internalId = ++instanceCounter;
  }
  disabledChanged() {
    this.emitStyle();
  }
  /**
   * Always returns value as array. If value is undefined, empty array is returned.
   */
  get valueAsArray() {
    return Array.isArray(this.value) ? this.value : (this.value !== undefined ? [this.value] : []);
  }
  optionsChanged(niu) {
    this.items = niu;
  }
  async valueChanged(niu, old) {
    if (this.valueChanging) {
      if (!deepEqual(niu, old)) {
        this.ionChange.emit({ value: this.value });
      }
    }
    else {
      this.buildVisibleItems();
    }
    this.valueChanging = false;
    this.emitStyle();
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
    var _a;
    this.ionStyle.emit({
      "interactive": !this.disabled && !this.readonly,
      "input": true,
      "has-placeholder": this.placeholder != null,
      "has-value": ((_a = this.valueAsArray) === null || _a === void 0 ? void 0 : _a.length) > 0,
      "has-focus": this.focused,
      "interactive-disabled": this.disabled,
    });
  }
  async buildVisibleItems() {
    var _a, _b;
    let visible = [];
    // values, that do not match items
    const unmatched = [];
    for (const value of this.valueAsArray) {
      const item = findValueItem([].concat((_a = this.items) !== null && _a !== void 0 ? _a : [], (_b = this.visibleItems) !== null && _b !== void 0 ? _b : []), value, this.comparator);
      if (item) {
        visible.push(item);
      }
      else {
        unmatched.push(value);
      }
    }
    if (unmatched.length > 0) {
      this.loading = true;
      if (this.lazyItems) {
        visible = await this.lazyItems(this.valueAsArray);
      }
      else if (this.items) {
        for (const item of this.items) {
          if (unmatched.length > 0 && item.group) {
            const subitems = typeof item.items === "function" ? await item.items(unmatched) : item.items;
            if (subitems) {
              for (let i = unmatched.length - 1; i >= 0; i--) {
                const subitem = findValueItem(subitems, unmatched[i], this.comparator);
                if (subitem) {
                  visible = (visible !== null && visible !== void 0 ? visible : []).concat([subitem]);
                  unmatched.splice(i, 1);
                }
              }
            }
          }
        }
      }
    }
    this.visibleItems = visible;
    this.loading = false;
    forceUpdate(this);
  }
  async open() {
    var _a, _b;
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
    const overlayProps = {
      overlay,
      items: (_a = this.items) === null || _a === void 0 ? void 0 : _a.slice(),
      lazyItems: this.lazyItems,
      values: (_b = this.valueAsArray.slice()) !== null && _b !== void 0 ? _b : [],
      multiple: !!this.multiple,
      overlayTitle: overlayTitle,
      comparator: this.comparator,
      labelFormatter: this.labelFormatter,
      sortable: !!this.sortable,
      empty: !!this.empty,
      searchTest: this.searchTest,
      // whiteSpace: this.overlayWhiteSpace,
      checkValidator: this.checkValidator
    };
    const { willDismiss, didDismiss } = await showSelectOverlay(overlayProps, { target: this.element });
    const result = await willDismiss;
    if (result.role === "ok") {
      this.valueChanging = true;
      const { values, items } = result.data;
      this.visibleItems = items;
      if (this.multiple || this.alwaysArray) {
        this.value = values;
      }
      else {
        this.value = values.length > 0 ? values[0] : undefined;
      }
    }
    await didDismiss;
    this.setFocus();
  }
  async configureSortable() {
    if (this.sortable && this.multiple) {
      const prevInstance = this.sortableInstance;
      this.sortableInstance = (await import('./initSortable.js')).initSortable.call(this);
      if (prevInstance && prevInstance !== this.sortableInstance) {
        prevInstance.destroy();
      }
    }
    else if (this.sortableInstance) {
      this.sortableInstance.destroy();
      this.sortableInstance = undefined;
    }
  }
  connectedCallback() {
    if (!this.items && this.options) {
      this.items = this.options;
    }
    this.emitStyle();
    this.buildVisibleItems();
    if (!this.element.hasAttribute("tabIndex")) {
      this.element.setAttribute("tabIndex", "0");
    }
    this.configureSortable();
  }
  renderValue(values, value, index) {
    const LabelComponent = this.labelComponent;
    const ValueComponent = this.sortable ? "ion-chip" : "span";
    const item = findValueItem(this.visibleItems, value, this.comparator);
    const label = valueLabel(this.visibleItems, value, { comparator: this.comparator, formatter: this.labelFormatter });
    return h(Fragment, null, h(ValueComponent, Object.assign({ key: value }, (ValueComponent === "ion-chip" ? { outline: true } : {}), { class: { [sortableItemClass]: true } }), !!LabelComponent && h(LabelComponent, { value: value, item: item, label: label, index: index, readonly: this.readonly }), !LabelComponent && h("span", null, label, !this.sortable && index < values.length - 1 ? this.separator : "")), !this.readonly && !this.disabled && this.multiple && this.sortable && index === values.length - 1 && h("ion-chip", { key: "more" }, h("ion-icon", { name: "ellipsis-horizontal", style: { margin: "0px" } })));
  }
  render() {
    const values = this.valueAsArray;
    const empty = values.length === 0;
    return h(Host, { role: "combobox", "aria-haspopup": "dialog", class: {
        "ionx--sortable": this.sortable && !empty && !this.disabled && !this.readonly,
        "ionx--readonly": !!this.readonly,
        "ionx--disabled": !!this.disabled
      }, onClick: () => this.open() }, h("div", { class: "ionx--inner" }, this.loading && h("ion-spinner", { name: "dots" }), !this.loading && h(Fragment, null, h("div", { class: {
        "ionx--text": true,
        "ionx--placeholder-visible": empty && !!this.placeholder
      } }, empty && this.placeholder && h("span", null, this.placeholder), values.map((value, index) => this.renderValue(values, value, index))), !this.readonly && !this.disabled && h(Fragment, null, (!this.sortable || empty) && h("div", { class: "ionx--icon", role: "presentation" }, h("div", { class: "ionx--icon-inner" }))))));
  }
  get element() { return this; }
  static get watchers() { return {
    "disabled": ["disabledChanged"],
    "options": ["optionsChanged"],
    "value": ["valueChanged"],
    "sortable": ["configureSortable"],
    "multiple": ["configureSortable"]
  }; }
  static get style() { return selectCss; }
};

const selectOverlayCss = ".sc-ionx-select-overlay-h{display:block}.sc-ionx-select-overlay-h ion-list.sc-ionx-select-overlay{margin:4px 0px;padding:0px}.sc-ionx-select-overlay-h ion-item.sc-ionx-select-overlay:last-child{--border-width:0px}.sc-ionx-select-overlay-h ion-checkbox.sc-ionx-select-overlay{margin-right:16px;margin-left:0px}.sc-ionx-select-overlay-h ion-item.ionx--divider.sc-ionx-select-overlay ion-label.sc-ionx-select-overlay{margin-top:32px;font-weight:500;font-size:small}ion-popover.sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay{--overflow:initial !important;height:auto !important;contain:content}ion-popover.sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay ion-item.sc-ionx-select-overlay ion-label.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-content.sc-ionx-select-overlay ion-item.sc-ionx-select-overlay ion-label.sc-ionx-select-overlay{white-space:normal}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay{position:sticky;bottom:0px}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-toolbar.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-toolbar.sc-ionx-select-overlay{--padding-start:0px;--padding-end:0px;--padding-top:0px;--padding-bottom:0px;--min-height:none;--ion-safe-area-bottom:0px;--ion-safe-area-top:0px;--ion-safe-area-start:0px;--ion-safe-area-end:0px}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay div.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay div.sc-ionx-select-overlay{flex:1;display:flex}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay{min-height:44px;margin:0px}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:last-child),ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:last-child){font-weight:400}ion-popover.sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:last-child,ion-popover .sc-ionx-select-overlay-h ion-footer.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:last-child{font-weight:500}ion-popover.sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay div.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay div.sc-ionx-select-overlay{justify-content:flex-end}ion-popover.sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.md.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay{flex:none !important}ion-popover.sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay,ion-popover .sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay{width:50%}ion-popover.sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:first-child),ion-popover .sc-ionx-select-overlay-h ion-footer.ios.sc-ionx-select-overlay ion-button.sc-ionx-select-overlay:not(:first-child){border-left:var(--ionx-border-width) solid var(--ion-border-color)}";

defineIonxToolbar();
defineIonxLoading();
const indexAttribute = "ionx-select--idx";
const SelectOverlay = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.didEnter = false;
    this.expandedGroups = {};
    this.loadingGroups = {};
    this.groupsItems = {};
  }
  async search(ev) {
    var _a;
    const query = ((_a = ev.detail.value) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) || undefined;
    if (query) {
      const items = [];
      for (let i = 0; i < this.items.length; i++) {
        if (!this.items[i].divider) {
          const label = (this.items[i].label instanceof MessageRef ? intl.message(this.items[i].label) : this.items[i].label) || (this.labelFormatter ? this.labelFormatter(this.items[i].value) : `${this.items[i].value}`);
          if (this.searchTest) {
            if (!this.searchTest(query, this.items[i].value, label)) {
              continue;
            }
          }
          else if ((label || "").toLowerCase().indexOf(query) < 0) {
            continue;
          }
          // search for parent divider
          for (let ii = i - 1; ii >= 0; ii--) {
            if (this.items[ii].divider) {
              items.push(this.items[ii]);
              break;
            }
          }
          items.push(this.items[i]);
        }
      }
      this.visibleItems = items;
    }
    else {
      this.visibleItems = this.items.slice();
    }
  }
  async onDidEnter() {
    var _a, _b, _c;
    if (this.lazyItems) {
      this.items = await this.lazyItems();
    }
    else {
      // values, that do not match items
      const unloaded = [];
      for (const value of this.values) {
        if (!findValueItem((_a = this.items) !== null && _a !== void 0 ? _a : [], value, this.comparator)) {
          unloaded.push(value);
        }
      }
      if (unloaded.length > 0) {
        for (const group of this.items.filter(item => item.group)) {
          let subitems;
          if ((_c = (_b = group.values) === null || _b === void 0 ? void 0 : _b.call(group, unloaded)) === null || _c === void 0 ? void 0 : _c.length) {
            subitems = typeof group.items === "function" ? await group.items() : group.items;
          }
          else if (Array.isArray(group.items) && unloaded.find(value => findValueItem(group.items, value, this.comparator))) {
            subitems = group.items;
          }
          if (subitems) {
            this.groupsItems[group.id] = subitems;
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i] === group) {
                this.items.splice(i, 1, group, ...subitems);
                this.expandedGroups[group.id] = true;
                break;
              }
            }
          }
        }
      }
    }
    this.useVirtualScroll = this.overlay === "modal" && this.items.length > 100;
    this.visibleItems = this.items.slice();
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
    await waitTillHydrated(this.element);
    const indexToSelect = (this.values.length > 0 && this.items.findIndex(option => this.values.findIndex(v => isEqualValue(option.value, v, this.comparator)) > -1)) || -1;
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
        let item;
        try {
          await waitTill(() => !!(item = this.element.querySelector(`ion-item[${indexAttribute}="${index - 1}"]`)), undefined, 5000);
          item.scrollIntoView();
        }
        catch (_a) {
        }
      }
    }
  }
  onClick(ev, item) {
    const wasChecked = this.values.findIndex(value => isEqualValue(value, item.value, this.comparator)) > -1;
    if (!this.empty && this.values.length === 1 && wasChecked) {
      ev.target.checked = true;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      return;
    }
    this.onCheck(item, !wasChecked);
  }
  onCheck(item, checked) {
    const valuesBefore = this.values.slice();
    VALUES: {
      for (let i = 0; i < this.values.length; i++) {
        if (isEqualValue(this.values[i], item.value, this.comparator)) {
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
          this.values.push(item.value);
        }
        else {
          this.values = [item.value];
        }
      }
    }
    if (this.multiple && this.checkValidator) {
      this.values = this.checkValidator(item.value, checked, valuesBefore) || [];
    }
    if (!this.multiple) {
      this.ok();
    }
  }
  async toggleGroup(group) {
    var _a;
    if (!this.expandedGroups[group.id]) {
      this.expandedGroups[group.id] = true;
      this.loadingGroups[group.id] = true;
      forceUpdate(this);
      const subitems = (_a = this.groupsItems[group.id]) !== null && _a !== void 0 ? _a : (typeof group.items === "function" ? await group.items() : group.items);
      if (subitems) {
        this.groupsItems[group.id] = subitems;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i] === group) {
            this.items.splice(i, 1, group, ...subitems);
            this.visibleItems = this.items.slice();
            break;
          }
        }
      }
    }
    else {
      for (const subitem of this.groupsItems[group.id]) {
        const i = this.items.indexOf(subitem);
        if (i > -1) {
          this.items.splice(i, 1);
        }
      }
      this.visibleItems = this.items.slice();
      delete this.expandedGroups[group.id];
    }
    delete this.loadingGroups[group.id];
    forceUpdate(this);
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
    const items = [];
    // we build list of items, that are selected
    // when value is not associated with item, we remove given value
    for (let i = this.values.length - 1; i >= 0; i--) {
      const item = findValueItem(this.items, this.values[i], this.comparator);
      if (item) {
        items.push(item);
      }
      else {
        this.values.splice(i, 1);
      }
    }
    if (!this.sortable) {
      this.values.sort((a, b) => items.findIndex(o => isEqualValue(o.value, a, this.comparator)) - items.findIndex(o => isEqualValue(o.value, b, this.comparator)));
    }
    if (this.overlay === "modal") {
      const modal = this.element.closest("ion-modal");
      modal.dismiss({ values: this.values, items }, "ok");
    }
    else {
      const popover = this.element.closest("ion-popover");
      popover.dismiss({ values: this.values, items }, "ok");
    }
  }
  connectedCallback() {
    var _a, _b;
    this.visibleItems = (_a = this.items) === null || _a === void 0 ? void 0 : _a.slice();
    this.useVirtualScroll = this.overlay === "modal" && ((_b = this.items) === null || _b === void 0 ? void 0 : _b.length) > 100;
  }
  renderItem(item, index) {
    var _a, _b;
    if (!item) {
      return;
    }
    if (item.group) {
      return h("ion-item", { key: `group:${item.id}`, button: true, detail: true, detailIcon: this.expandedGroups[item.id] ? "chevron-up" : "chevron-down", onClick: () => this.toggleGroup(item) }, h("ion-label", null, (_a = (item.label ? (item.label instanceof MessageRef ? intl.message(item.label) : item.label) : undefined)) !== null && _a !== void 0 ? _a : (this.labelFormatter ? this.labelFormatter(item.value) : `${item.value}`)), this.loadingGroups[item.id] && h("ion-spinner", { name: "dots", slot: "end" }));
    }
    return h("ion-item", Object.assign({ key: index }, { [indexAttribute]: index }, { class: { "ionx--divider": item.divider } }), !item.divider && h("ion-checkbox", { class: "sc-ionx-select-overlay", slot: "start", checked: this.values.findIndex(v => isEqualValue(v, item.value, this.comparator)) > -1, onClick: ev => this.onClick(ev, item) }), h("ion-label", null, (_b = (item.label ? (item.label instanceof MessageRef ? intl.message(item.label) : item.label) : undefined)) !== null && _b !== void 0 ? _b : (this.labelFormatter ? this.labelFormatter(item.value) : `${item.value}`)));
  }
  render() {
    return h(Host, null, this.useVirtualScroll && !this.didEnter && h("div", { style: { visibility: "hidden" } }, this.renderItem(this.items.find(o => !o.divider), 0)), this.overlay === "modal" && h("ion-header", null, h("ionx-toolbar", { button: "close", buttonHandler: () => this.cancel() }, h("span", { slot: "title" }, this.overlayTitle), h("ion-button", { slot: "action", fill: "clear", onClick: () => this.ok() }, intl.message `@co.mmons/js-intl#Done`)), h("ion-toolbar", null, h("ion-searchbar", { type: "text", autocomplete: "off", placeholder: intl.message `@co.mmons/js-intl#Search`, onIonChange: ev => this.search(ev) }))), h("ion-content", { scrollY: this.overlay === "modal", scrollX: false }, !this.didEnter && this.overlay === "modal" && h("ionx-loading", { type: "spinner", cover: true, slot: "fixed" }), this.visibleItems && h("ion-list", { lines: "full" }, this.useVirtualScroll && h("ion-virtual-scroll", { items: this.visibleItems, approxItemHeight: this.virtualItemHeight, renderItem: (item, index) => this.renderItem(item, index) }), (this.overlay === "popover" || !this.useVirtualScroll) && this.visibleItems.map((item, index) => this.renderItem(item, index)))), this.multiple && this.overlay === "popover" && h("ion-footer", null, h("ion-toolbar", null, h("div", null, h("ion-button", { size: "small", fill: "clear", onClick: () => this.cancel() }, intl.message `@co.mmons/js-intl#Cancel`), h("ion-button", { size: "small", fill: "clear", onClick: () => this.ok() }, intl.message `@co.mmons/js-intl#Ok`)))));
  }
  get element() { return this; }
  static get style() { return selectOverlayCss; }
};

const IonxSelect = /*@__PURE__*/proxyCustomElement(Select, [2,"ionx-select",{"placeholder":[1],"overlay":[1],"overlayTitle":[1,"overlay-title"],"overlayOptions":[16],"alwaysArray":[4,"always-array"],"comparator":[1],"multiple":[4],"sortable":[4],"empty":[4],"readonly":[4],"disabled":[4],"searchTest":[16],"checkValidator":[16],"options":[16],"items":[16],"lazyItems":[16],"labelComponent":[1,"label-component"],"labelFormatter":[16],"separator":[1],"value":[1032]},[[0,"focus","onFocus"],[0,"blur","onBlur"]]]);
const IonxSelectOverlay = /*@__PURE__*/proxyCustomElement(SelectOverlay, [2,"ionx-select-overlay",{"overlay":[1],"overlayTitle":[1,"overlay-title"],"sortable":[4],"searchTest":[16],"items":[1040],"lazyItems":[16],"multiple":[4],"values":[1040],"empty":[4],"comparator":[1],"checkValidator":[16],"labelFormatter":[16],"visibleItems":[32],"didEnter":[32],"expandedGroups":[32],"loadingGroups":[32]},[[0,"ionViewDidEnter","onDidEnter"]]]);
const defineIonxSelect = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxSelect,
  IonxSelectOverlay
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxSelect, IonxSelectOverlay, defineIonxSelect, sortableItemClass as s, showSelectOverlay };
