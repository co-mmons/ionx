export interface DataTableColumnSortingOptions {
  sortingEnabled?: boolean;
  sort?: (a: any, b: any) => number;
}
