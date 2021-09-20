import {Component, h, Host, Prop, State, Watch} from "@stencil/core";
import {DataTableColumn} from "./DataTableColumn";
import {DataTableRow} from "./DataTableRow";
import {Filter} from "./filter/Filter";

@Component({
    tag: "ionx-data-table",
    styleUrl: "DataTable.scss"
})
export class DataTable {

    @Prop()
    columns: DataTableColumn[];

    @Prop()
    data: Array<any[] | DataTableRow>;

    @State()
    visibleData: Array<any[] | DataTableRow>;

    filters: {[columnId: string]: Filter} = {};

    columnData(column: DataTableColumn, columnIndex: number) {
        return this.data?.map(row => Array.isArray(row) ? row[columnIndex] : row[column.id]).filter(v => v !== undefined);
    }

    setColumnFilter(column: DataTableColumn, value: any) {

        if (value === undefined) {
            delete this.filters[column.id];
        } else {
            this.filters[column.id] = value;
        }

        this.applyFilters();
    }

    applyFilters() {

        if (Object.keys(this.filters).length === 0) {
            this.visibleData = this.data.slice();

        } else {

            const data = [];
            const columnsIdIndex = {};

            ROWS: for (const row of this.data) {

                for (const columnId in this.filters) {

                    const columnIndex = columnsIdIndex[columnId] ?? (columnsIdIndex[columnId] = this.columns.findIndex(column => column.id === columnId));

                    let value: any;

                    if (Array.isArray(row)) {
                        value = row[columnIndex];
                    } else {
                        value = row[columnId];
                    }

                    if (!this.filters[columnId].test(value)) {
                        continue ROWS;
                    }
                }

                data.push(row);
            }

            this.visibleData = data;
        }
    }

    @Watch("data")
    dataChanged() {
        this.applyFilters();
    }

    connectedCallback() {
        this.visibleData = this.data?.slice();
    }

    renderCell(column: DataTableColumn, columnIndex: number, row: any, accessByIndex: boolean) {
        const value = row[accessByIndex ? columnIndex : column.id];
        return <td>{column.formatter ? column.formatter(value) : value}</td>
    }

    render() {
        return <Host>
            <table>
                <thead>
                    <tr>
                        {this.columns?.map((column, columnIndex) => <ionx-data-table-th
                            filterData={() => this.columnData(column, columnIndex)}
                            filterApply={value => this.setColumnFilter(column, value)}
                            filterType={column.filterType}
                            filterCurrent={() => this.filters[column.id]}
                            filterEnabled={column.filterEnabled}>{column.label}</ionx-data-table-th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.visibleData?.map(row => <tr>
                        {this.columns.map((column, columnIndex) => this.renderCell(column, columnIndex, row, Array.isArray(row)))}
                    </tr>)}
                </tbody>
            </table>
        </Host>
    }
}
