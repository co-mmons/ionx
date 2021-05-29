export interface DataTableColumnFilterOptions {
    filterEnabled?: boolean;
    filterType?: DataTableColumnFilterOptions.FilterType;
}

export namespace DataTableColumnFilterOptions {
    export type FilterType = "search" | "select";
}
