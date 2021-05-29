import { forceUpdate, h, Host, attachShadow, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { intl } from '@co.mmons/js-intl';
import { popoverController } from '@ionic/core';
import { defineIonxSelect, showSelectOverlay } from 'ionx/Select';

const dataTableCss = "ionx-data-table{display:block;overflow:auto;max-height:100%;border:var(--ionx-border-width) solid var(--ion-border-color);border-radius:var(--ionx-border-radius)}ionx-data-table>table{width:100%}ionx-data-table>table>tbody>tr>td{padding:8px;border:var(--ionx-border-width) solid var(--ion-border-color)}ionx-data-table>table>tbody>tr>td:first-child{border-left:0}ionx-data-table>table>tbody>tr>td:last-child{border-right:0}ionx-data-table>table>tbody>tr:last-child>td{border-bottom:0}";

const DataTable = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.filters = {};
  }
  columnData(column, columnIndex) {
    var _a;
    return (_a = this.data) === null || _a === void 0 ? void 0 : _a.map(row => Array.isArray(row) ? row[columnIndex] : row[column.id]).filter(v => v !== undefined);
  }
  setColumnFilter(column, value) {
    if (value === undefined) {
      delete this.filters[column.id];
    }
    else {
      this.filters[column.id] = value;
    }
    this.applyFilters();
  }
  applyFilters() {
    var _a;
    if (Object.keys(this.filters).length === 0) {
      this.visibleData = this.data.slice();
    }
    else {
      const data = [];
      const columnsIdIndex = {};
      for (const row of this.data) {
        for (const columnId in this.filters) {
          const columnIndex = (_a = columnsIdIndex[columnId]) !== null && _a !== void 0 ? _a : (columnsIdIndex[columnId] = this.columns.findIndex(column => column.id === columnId));
          let value;
          if (Array.isArray(row)) {
            value = row[columnIndex];
          }
          else {
            value = row[columnId];
          }
          if (this.filters[columnId].test(value)) {
            data.push(row);
          }
        }
      }
      this.visibleData = data;
    }
    forceUpdate(this);
  }
  connectedCallback() {
    var _a;
    this.visibleData = (_a = this.data) === null || _a === void 0 ? void 0 : _a.slice();
  }
  render() {
    var _a, _b;
    return h(Host, null, h("table", null, h("thead", null, h("tr", null, (_a = this.columns) === null || _a === void 0 ? void 0 : _a.map((column, columnIndex) => h("ionx-data-table-th", { filterData: () => this.columnData(column, columnIndex), filterApply: value => this.setColumnFilter(column, value), filterType: column.filterType, filterCurrent: () => this.filters[column.id], filterEnabled: column.filterEnabled }, column.label)))), h("tbody", null, (_b = this.visibleData) === null || _b === void 0 ? void 0 : _b.map(row => h("tr", null, Array.isArray(row) && row.map(cell => h("td", null, cell)))))));
  }
  static get style() { return dataTableCss; }
};

const searchPopoverCss = ":host ion-footer{position:sticky;bottom:0px}:host ion-footer ion-toolbar{--padding-start:0px;--padding-end:0px;--padding-top:0px;--padding-bottom:0px;--min-height:none;--ion-safe-area-bottom:0px;--ion-safe-area-top:0px;--ion-safe-area-start:0px;--ion-safe-area-end:0px}:host ion-footer div{flex:1;display:flex}:host ion-footer ion-button{min-height:44px;margin:0px}:host ion-footer ion-button:not(:last-child){font-weight:400}:host ion-footer ion-button:last-child{font-weight:500}:host ion-footer.md div{justify-content:flex-end}:host ion-footer.md ion-button{flex:none !important}:host ion-footer.ios ion-button{width:50%}:host ion-footer.ios ion-button:not(:first-child){border-left:var(--ionx-border-width) solid var(--ion-border-color)}";

const SearchPopover = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  cancel() {
    popoverController.dismiss();
  }
  ok() {
    popoverController.dismiss(this.element.shadowRoot.querySelector("ion-searchbar").value, "ok");
  }
  didEnter() {
    this.element.shadowRoot.querySelector("ion-searchbar").setFocus();
  }
  render() {
    return h(Host, null, h("ion-searchbar", { type: "text", value: this.value, enterkeyhint: "search", inputmode: "search", spellcheck: false, placeholder: intl.message `@co.mmons/js-intl#Search for...`, onKeyDown: ev => ev.key === "Enter" ? this.ok() : undefined }), h("ion-footer", null, h("ion-toolbar", null, h("div", null, h("ion-button", { size: "small", fill: "clear", onClick: () => this.cancel() }, intl.message `@co.mmons/js-intl#Cancel`), h("ion-button", { size: "small", fill: "clear", onClick: () => this.ok() }, intl.message `@co.mmons/js-intl#Ok`)))));
  }
  get element() { return this; }
  static get style() { return searchPopoverCss; }
};

class Filter {
}

class HasOneOfFilter extends Filter {
  constructor(values) {
    super();
    this.values = values;
  }
  test(value) {
    for (const v of this.values) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }
}

class MatchStringFilter extends Filter {
  constructor(value) {
    super();
    this.value = value;
  }
  test(value) {
    if (typeof value === "string" && value.indexOf(this.value) > -1) {
      return true;
    }
    return false;
  }
}

const thCss = ".sc-ionx-data-table-th-h{display:table-cell;position:sticky;top:0;background-color:var(--data-table-background-color, var(--ion-background-color, #fff));box-shadow:0 1px 0 0 var(--ion-border-color);border-color:var(--ion-border-color);border-style:solid;border-width:0 var(--ionx-border-width) 0 var(--ionx-border-width);padding:8px;font-weight:500}.sc-ionx-data-table-th-h:first-child{border-left:0}.sc-ionx-data-table-th-h:last-child{border-right:0}.sc-ionx-data-table-th-h .ionx--outer.sc-ionx-data-table-th{display:flex}.sc-ionx-data-table-th-h .ionx--outer.sc-ionx-data-table-th ion-button.sc-ionx-data-table-th{margin:0}";

defineIonxSelect();
const Th = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  dataTable() {
    return this.element.closest("ionx-data-table");
  }
  async filterClicked() {
    if (this.filterType === "select") {
      await this.filterSelect();
    }
    else if (this.filterType === "search") {
      await this.filterSearch();
    }
  }
  async filterSearch() {
    const current = this.filterCurrent();
    const popover = await popoverController.create({
      component: "ionx-data-table-search-filter",
      componentProps: {
        value: current instanceof MatchStringFilter ? current.value : undefined
      },
      event: { target: this.element.querySelector("ion-button") }
    });
    await popover.present();
    const result = await popover.onWillDismiss();
    if (result.role === "ok") {
      this.filterApply(result.data ? new MatchStringFilter(result.data) : undefined);
    }
  }
  async filterSelect() {
    const current = this.filterCurrent();
    const overlayTitle = this.element.querySelector("[slot-container=label]").innerText || this.element.title;
    const options = this.filterData().map(data => ({ label: data, value: data }));
    const { willDismiss } = await showSelectOverlay({
      overlay: "modal",
      multiple: true,
      empty: true,
      overlayTitle,
      options,
      values: current instanceof HasOneOfFilter ? current.values : []
    });
    const result = await willDismiss;
    if (result.role === "ok") {
      this.filterApply(result.data.length === 0 ? undefined : new HasOneOfFilter(result.data));
    }
  }
  render() {
    return h(Host, null, h("div", { class: "ionx--outer" }, h("div", { "slot-container": "label" }, h("slot", null)), this.filterEnabled && h("ion-button", { fill: "clear", size: "small", shape: "round", onClick: () => this.filterClicked() }, h("ion-icon", { name: this.filterType === "search" ? "search" : "filter" }))));
  }
  get element() { return this; }
  static get style() { return thCss; }
};

const IonxDataTable = /*@__PURE__*/proxyCustomElement(DataTable, [0,"ionx-data-table",{"columns":[16],"data":[16]}]);
const IonxDataTableSearchFilter = /*@__PURE__*/proxyCustomElement(SearchPopover, [1,"ionx-data-table-search-filter",{"value":[1]},[[0,"ionViewDidEnter","didEnter"]]]);
const IonxDataTableTh = /*@__PURE__*/proxyCustomElement(Th, [6,"ionx-data-table-th",{"filterEnabled":[4,"filter-enabled"],"filterType":[1,"filter-type"],"filterData":[16],"filterApply":[16],"filterCurrent":[16]}]);
const defineIonxDataTable = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxDataTable,
  IonxDataTableSearchFilter,
  IonxDataTableTh
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxDataTable, IonxDataTableSearchFilter, IonxDataTableTh, defineIonxDataTable };
