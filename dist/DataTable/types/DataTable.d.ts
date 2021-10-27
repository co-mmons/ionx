import { DataTableColumn } from "./DataTableColumn";
import { DataTableRow } from "./DataTableRow";
import { Filter } from "./filter/Filter";
export declare class DataTable {
  columns: DataTableColumn[];
  data: Array<any[] | DataTableRow>;
  visibleData: Array<any[] | DataTableRow>;
  filters: {
    [columnId: string]: Filter;
  };
  sortingColumn: {
    id?: string;
    order?: "asc" | "desc";
  };
  columnData(column: DataTableColumn, columnIndex: number): any[];
  setColumnFilter(column: DataTableColumn, value: any): void;
  applyFilters(): void;
  applySorting(rows: any[]): void;
  setColumnSorting(column: DataTableColumn, order: "asc" | "desc" | false): void;
  dataChanged(): void;
  connectedCallback(): void;
  renderCell(column: DataTableColumn, columnIndex: number, row: any, accessByIndex: boolean): any;
  render(): any;
}
