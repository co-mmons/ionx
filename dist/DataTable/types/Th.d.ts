import { DataTableColumnFilterOptions } from "./DataTableColumnFilterOptions";
import { Filter } from "./filter/Filter";
export declare class Th implements DataTableColumnFilterOptions {
  element: HTMLElement;
  filterEnabled: boolean;
  filterType: DataTableColumnFilterOptions.FilterType;
  filterData: () => any[];
  filterApply: (filter: Filter) => any | void;
  /**
   * Returns currently applied filter for given column.
   */
  filterCurrent: () => Filter;
  sortingActive: "asc" | "desc" | false;
  sortingApply: (order: "asc" | "desc" | false) => void;
  filterActive: boolean;
  dataTable(): HTMLIonxDataTableElement;
  sortingClicked(): Promise<void>;
  filterClicked(): Promise<void>;
  filterSearch(): Promise<void>;
  filterSelect(): Promise<void>;
  render(): any;
}
