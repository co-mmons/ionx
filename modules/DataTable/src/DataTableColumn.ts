import {DataTableColumnFilterOptions} from "./DataTableColumnFilterOptions";

export interface DataTableColumn extends DataTableColumnFilterOptions {
    label: string;
    id: string;
    formatter?: (value: any) => string;
}
