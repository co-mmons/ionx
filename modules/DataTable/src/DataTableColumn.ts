import {DataTableColumnFilterOptions} from "./DataTableColumnFilterOptions";
import {DataTableColumnSortingOptions} from "./DataTableColumnSortingOptions";

export interface DataTableColumn extends DataTableColumnFilterOptions, DataTableColumnSortingOptions {
    label: string;
    id: string;
    formatter?: (value: any) => string;
}
