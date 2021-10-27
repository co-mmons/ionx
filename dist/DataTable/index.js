import { forceUpdate, h, Host, attachShadow, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { toString } from '@co.mmons/js-utils/core';
import { intl } from '@co.mmons/js-intl';
import { popoverController } from '@ionic/core';
import { defineIonxSelect, showSelectOverlay } from 'ionx/Select';

const dataTableCss = "ionx-data-table{display:block;overflow:auto;max-height:100%;border:var(--ionx-border-width) solid var(--ion-border-color);border-radius:var(--ionx-border-radius);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ionx-data-table>table{width:100%}ionx-data-table>table>tbody{-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto}ionx-data-table>table>tbody>tr>td{padding:8px;border:var(--ionx-border-width) solid var(--ion-border-color)}ionx-data-table>table>tbody>tr>td:first-child{border-left:0}ionx-data-table>table>tbody>tr>td:last-child{border-right:0}ionx-data-table>table>tbody>tr:last-child>td{border-bottom:0}";

const DataTable = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.filters = {};
    this.sortingColumn = {};
  }
  columnData(column, columnIndex) {
    return this.data?.map(row => Array.isArray(row) ? row[columnIndex] : row[column.id]).filter(v => v !== undefined);
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
    let data = [];
    if (Object.keys(this.filters).length === 0) {
      data = this.data.slice();
    }
    else {
      const columnsIdIndex = {};
      ROWS: for (const row of this.data) {
        for (const columnId in this.filters) {
          const columnIndex = columnsIdIndex[columnId] ?? (columnsIdIndex[columnId] = this.columns.findIndex(column => column.id === columnId));
          let value;
          if (Array.isArray(row)) {
            value = row[columnIndex];
          }
          else {
            value = row[columnId];
          }
          if (!this.filters[columnId].test(value)) {
            continue ROWS;
          }
        }
        data.push(row);
      }
    }
    if (this.sortingColumn.id) {
      this.applySorting(data);
    }
    this.visibleData = data;
  }
  applySorting(rows) {
    if (!this.sortingColumn.id) {
      this.applyFilters();
    }
    else {
      const column = this.columns.find(c => c.id === this.sortingColumn.id);
      const columnIndex = this.columns.findIndex(c => c.id === column.id);
      if (!column || !column.sortingEnabled) {
        this.sortingColumn = {};
      }
      else {
        const order = this.sortingColumn.order === "asc" ? 1 : -1;
        rows.sort((aRow, bRow) => {
          const aVal = Array.isArray(aRow) ? aRow[columnIndex] : aRow[column.id];
          const bVal = Array.isArray(bRow) ? bRow[columnIndex] : bRow[column.id];
          if (column.sort) {
            return column.sort(aVal, bVal) * order;
          }
          else {
            return toString(aVal).localeCompare(toString(bVal)) * order;
          }
        });
      }
    }
  }
  setColumnSorting(column, order) {
    const prev = this.sortingColumn.id;
    if (!order) {
      this.sortingColumn = {};
    }
    else {
      this.sortingColumn = { id: column.id, order };
    }
    if (prev !== this.sortingColumn.id) {
      this.applyFilters();
    }
    else {
      this.applySorting(this.visibleData);
      forceUpdate(this);
    }
  }
  dataChanged() {
    this.applyFilters();
  }
  connectedCallback() {
    this.visibleData = this.data?.slice();
  }
  renderCell(column, columnIndex, row, accessByIndex) {
    const value = row[accessByIndex ? columnIndex : column.id];
    return h("td", null, column.formatter ? column.formatter(value) : value);
  }
  render() {
    return h(Host, null, h("table", null, h("thead", null, h("tr", null, this.columns?.map((column, columnIndex) => h("ionx-data-table-th", { filterData: () => this.columnData(column, columnIndex), filterApply: value => this.setColumnFilter(column, value), filterType: column.filterType, filterCurrent: () => this.filters[column.id], filterEnabled: column.filterEnabled, sortingEnabled: column.sortingEnabled, sortingApply: order => this.setColumnSorting(column, order), sortingActive: this.sortingColumn.id === column.id ? this.sortingColumn.order : undefined }, column.label)))), h("tbody", null, this.visibleData?.map(row => h("tr", null, this.columns.map((column, columnIndex) => this.renderCell(column, columnIndex, row, Array.isArray(row))))))));
  }
  static get watchers() { return {
    "data": ["dataChanged"]
  }; }
  static get style() { return dataTableCss; }
};

const searchPopoverCss = ":host ion-footer{position:-webkit-sticky;position:sticky;bottom:0px}:host ion-footer ion-toolbar{--padding-start:0px;--padding-end:0px;--padding-top:0px;--padding-bottom:0px;--min-height:none;--ion-safe-area-bottom:0px;--ion-safe-area-top:0px;--ion-safe-area-start:0px;--ion-safe-area-end:0px}:host ion-footer div{flex:1;display:flex}:host ion-footer ion-button{min-height:44px;margin:0px}:host ion-footer ion-button:not(:last-child){font-weight:400}:host ion-footer ion-button:last-child{font-weight:500}:host ion-footer.md div{justify-content:flex-end}:host ion-footer.md ion-button{flex:none !important}:host ion-footer.ios ion-button{width:50%}:host ion-footer.ios ion-button:not(:first-child){border-left:var(--ionx-border-width) solid var(--ion-border-color)}";

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
    if (typeof value === "string" && value.toLocaleLowerCase().indexOf(this.value.toLocaleLowerCase()) > -1) {
      return true;
    }
    return false;
  }
}

const thCss = ".sc-ionx-data-table-th-h{display:table-cell;position:-webkit-sticky;position:sticky;top:0;background-color:var(--data-table-background-color, var(--ion-background-color, #fff));box-shadow:0 1px 0 0 var(--ion-border-color);border-color:var(--ion-border-color);border-style:solid;border-width:0 var(--ionx-border-width) 0 var(--ionx-border-width);padding:8px;font-weight:500}.sc-ionx-data-table-th-h:first-child{border-left:0}.sc-ionx-data-table-th-h:last-child{border-right:0}.sc-ionx-data-table-th-h .ionx--outer.sc-ionx-data-table-th{display:flex;align-items:center}.sc-ionx-data-table-th-h .ionx--outer.sc-ionx-data-table-th ion-button.sc-ionx-data-table-th{margin:0;--padding-start:4px;--padding-end:4px}.sc-ionx-data-table-th-h .ionx--outer.sc-ionx-data-table-th ion-button.sc-ionx-data-table-th:first-of-type{margin-left:4px}.sc-ionx-data-table-th-h .ionx--outer.sc-ionx-data-table-th ion-button.sc-ionx-data-table-th:last-of-type{margin-right:4px}.sc-ionx-data-table-th-h ion-icon[ionx--sorting].sc-ionx-data-table-th{--data-table--sorting-asc:var(--ion-border-color);--data-table--sorting-desc:var(--ion-border-color)}.sc-ionx-data-table-th-h ion-icon[ionx--sorting][ionx--sorting=asc].sc-ionx-data-table-th{--data-table--sorting-asc:var(--ion-color-primary)}.sc-ionx-data-table-th-h ion-icon[ionx--sorting][ionx--sorting=desc].sc-ionx-data-table-th{--data-table--sorting-desc:var(--ion-color-primary)}";

defineIonxSelect();
const Th = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  dataTable() {
    return this.element.closest("ionx-data-table");
  }
  async sortingClicked() {
    if (this.sortingActive === "asc") {
      this.sortingApply("desc");
    }
    else if (this.sortingActive === "desc") {
      this.sortingApply(false);
    }
    else {
      this.sortingApply("asc");
    }
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
      const value = result.data?.trim();
      this.filterApply(value ? new MatchStringFilter(value) : undefined);
      this.filterActive = !!value;
    }
  }
  async filterSelect() {
    const current = this.filterCurrent();
    const overlayTitle = this.element.querySelector("[slot-container=label]").innerText || this.element.title;
    const items = this.filterData()
      .filter((v, i, a) => !a.includes(v, i + 1))
      .map(data => ({ label: toString(data), value: data }))
      .sort((a, b) => (a.label || "").localeCompare(b.label || ""));
    const { willDismiss } = await showSelectOverlay({
      overlay: "modal",
      multiple: true,
      empty: true,
      overlayTitle,
      items,
      values: current instanceof HasOneOfFilter ? current.values : []
    });
    const result = await willDismiss;
    if (result.role === "ok") {
      this.filterApply(result.data.values.length === 0 ? undefined : new HasOneOfFilter(result.data.values));
      this.filterActive = result.data.values.length > 0;
    }
  }
  render() {
    return h(Host, null, h("div", { class: "ionx--outer" }, h("div", { "slot-container": "label" }, h("slot", null)), this.sortingEnabled && h("ion-button", { fill: "clear", size: "small", shape: "round", color: this.filterActive ? "success" : "primary", onClick: () => this.sortingClicked() }, h("ion-icon", { "ionx--sorting": this.sortingActive || "no", src: "/assets/ionx.DataTable/sort.svg" })), this.filterEnabled && h("ion-button", { fill: "clear", size: "small", shape: "round", color: this.filterActive ? "success" : "primary", onClick: () => this.filterClicked() }, h("ion-icon", { name: this.filterType === "search" ? "search" : "filter" }))));
  }
  get element() { return this; }
  static get style() { return thCss; }
};

const IonxDataTable = /*@__PURE__*/proxyCustomElement(DataTable, [0,"ionx-data-table",{"columns":[16],"data":[16],"visibleData":[32]}]);
const IonxDataTableSearchFilter = /*@__PURE__*/proxyCustomElement(SearchPopover, [1,"ionx-data-table-search-filter",{"value":[1]},[[0,"ionViewDidEnter","didEnter"]]]);
const IonxDataTableTh = /*@__PURE__*/proxyCustomElement(Th, [6,"ionx-data-table-th",{"filterEnabled":[4,"filter-enabled"],"filterType":[1,"filter-type"],"filterData":[16],"filterApply":[16],"filterCurrent":[16],"sortingEnabled":[4,"sorting-enabled"],"sortingActive":[8,"sorting-active"],"sortingApply":[16],"filterActive":[32]}]);
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
