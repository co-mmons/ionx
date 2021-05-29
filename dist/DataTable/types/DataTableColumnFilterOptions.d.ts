export interface DataTableColumnFilterOptions {
  filterEnabled?: boolean;
  filterType?: DataTableColumnFilterOptions.FilterType;
}
export declare namespace DataTableColumnFilterOptions {
  type FilterType = "search" | "select";
}
