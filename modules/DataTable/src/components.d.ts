/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { DataTableColumn } from "./DataTableColumn";
import { DataTableRow } from "./DataTableRow";
import { DataTableColumnFilterOptions } from "./DataTableColumnFilterOptions";
import { Filter } from "./filter/Filter";
export namespace Components {
    interface IonxDataTable {
        "columns": DataTableColumn[];
        "data": Array<any[] | DataTableRow>;
    }
    interface IonxDataTableSearchFilter {
        "value": string;
    }
    interface IonxDataTableTh {
        "filterApply": (filter: Filter) => any | void;
        /**
          * Returns currently applied filter for given column.
         */
        "filterCurrent": () => Filter;
        "filterData": () => any[];
        "filterEnabled": boolean;
        "filterType": DataTableColumnFilterOptions.FilterType;
        "sortingActive": "asc" | "desc" | false;
        "sortingApply": (order: "asc" | "desc" | false) => void;
        "sortingEnabled": boolean;
    }
}
declare global {
    interface HTMLIonxDataTableElement extends Components.IonxDataTable, HTMLStencilElement {
    }
    var HTMLIonxDataTableElement: {
        prototype: HTMLIonxDataTableElement;
        new (): HTMLIonxDataTableElement;
    };
    interface HTMLIonxDataTableSearchFilterElement extends Components.IonxDataTableSearchFilter, HTMLStencilElement {
    }
    var HTMLIonxDataTableSearchFilterElement: {
        prototype: HTMLIonxDataTableSearchFilterElement;
        new (): HTMLIonxDataTableSearchFilterElement;
    };
    interface HTMLIonxDataTableThElement extends Components.IonxDataTableTh, HTMLStencilElement {
    }
    var HTMLIonxDataTableThElement: {
        prototype: HTMLIonxDataTableThElement;
        new (): HTMLIonxDataTableThElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-data-table": HTMLIonxDataTableElement;
        "ionx-data-table-search-filter": HTMLIonxDataTableSearchFilterElement;
        "ionx-data-table-th": HTMLIonxDataTableThElement;
    }
}
declare namespace LocalJSX {
    interface IonxDataTable {
        "columns"?: DataTableColumn[];
        "data"?: Array<any[] | DataTableRow>;
    }
    interface IonxDataTableSearchFilter {
        "value"?: string;
    }
    interface IonxDataTableTh {
        "filterApply"?: (filter: Filter) => any | void;
        /**
          * Returns currently applied filter for given column.
         */
        "filterCurrent"?: () => Filter;
        "filterData"?: () => any[];
        "filterEnabled"?: boolean;
        "filterType"?: DataTableColumnFilterOptions.FilterType;
        "sortingActive"?: "asc" | "desc" | false;
        "sortingApply"?: (order: "asc" | "desc" | false) => void;
        "sortingEnabled"?: boolean;
    }
    interface IntrinsicElements {
        "ionx-data-table": IonxDataTable;
        "ionx-data-table-search-filter": IonxDataTableSearchFilter;
        "ionx-data-table-th": IonxDataTableTh;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-data-table": LocalJSX.IonxDataTable & JSXBase.HTMLAttributes<HTMLIonxDataTableElement>;
            "ionx-data-table-search-filter": LocalJSX.IonxDataTableSearchFilter & JSXBase.HTMLAttributes<HTMLIonxDataTableSearchFilterElement>;
            "ionx-data-table-th": LocalJSX.IonxDataTableTh & JSXBase.HTMLAttributes<HTMLIonxDataTableThElement>;
        }
    }
}
