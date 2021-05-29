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
  columnData(column: DataTableColumn, columnIndex: number): any[];
  setColumnFilter(column: DataTableColumn, value: any): void;
  applyFilters(): void;
  connectedCallback(): void;
  renderCell(column: DataTableColumn, columnIndex: number, row: any, accessByIndex: boolean): any;
  render(): any;
}
