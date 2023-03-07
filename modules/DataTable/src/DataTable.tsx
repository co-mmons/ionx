import {toString} from "@co.mmons/js-utils/core";
import {Component, forceUpdate, h, Host, Prop, State, Watch} from "@stencil/core";
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

    @Prop()
    headingRowStyle: any;

    @Prop()
    headingCellStyle: any;

    @Prop()
    rowStyle: any;

    @Prop()
    cellStyle: any;

    @State()
    visibleData: Array<any[] | DataTableRow>;

    filters: {[columnId: string]: Filter} = {};

    sortingColumn: {id?: string, order?: "asc" | "desc"} = {};

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

        let data = [];

        if (Object.keys(this.filters).length === 0) {
            data = this.data.slice();

        } else {

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
        }

        if (this.sortingColumn.id) {
            this.applySorting(data);
        }

        this.visibleData = data;
    }

    applySorting(rows: any[]) {

        if (!this.sortingColumn.id) {
            this.applyFilters();

        } else {

            const column = this.columns.find(c => c.id === this.sortingColumn.id);
            const columnIndex = this.columns.findIndex(c => c.id === column.id);

            if (!column || !column.sortingEnabled) {
                this.sortingColumn = {};

            } else {

                const order = this.sortingColumn.order === "asc" ? 1 : -1;

                rows.sort((aRow, bRow) => {

                    const aVal = Array.isArray(aRow) ? aRow[columnIndex] : aRow[column.id];
                    const bVal = Array.isArray(bRow) ? bRow[columnIndex] : bRow[column.id];

                    if (column.sort) {
                        return column.sort(aVal, bVal) * order;
                    } else {
                        return toString(aVal === null || aVal === undefined ? "" : aVal).localeCompare(toString(bVal === null || bVal === undefined ? "" : bVal)) * order;
                    }
                })

            }
        }
    }

    setColumnSorting(column: DataTableColumn, order: "asc" | "desc" | false) {

        const prev = this.sortingColumn.id;

        if (!order) {
            this.sortingColumn = {};
        } else {
            this.sortingColumn = {id: column.id, order};
        }

        if (prev !== this.sortingColumn.id) {
            this.applyFilters();
        } else {
            this.applySorting(this.visibleData);
            forceUpdate(this);
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
        return <td style={this.cellStyle}>{column.formatter ? column.formatter(value) : value}</td>
    }

    render() {
        return <Host>
            <table>
                <thead>
                    <tr style={this.headingRowStyle}>
                        {this.columns?.map((column, columnIndex) => <ionx-data-table-th
                            style={this.headingCellStyle}
                            filterData={() => this.columnData(column, columnIndex)}
                            filterApply={value => this.setColumnFilter(column, value)}
                            filterType={column.filterType}
                            filterCurrent={() => this.filters[column.id]}
                            filterEnabled={column.filterEnabled}
                            sortingEnabled={column.sortingEnabled}
                            sortingApply={order => this.setColumnSorting(column, order)}
                            sortingActive={this.sortingColumn.id === column.id ? this.sortingColumn.order : undefined}>{column.label}</ionx-data-table-th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.visibleData?.map(row => <tr style={this.rowStyle}>
                        {this.columns.map((column, columnIndex) => this.renderCell(column, columnIndex, row, Array.isArray(row)))}
                    </tr>)}
                </tbody>
            </table>
        </Host>
    }
}
