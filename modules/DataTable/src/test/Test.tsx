import {Component, ComponentInterface, h} from "@stencil/core";
import {DataTableColumn} from "../DataTableColumn";

@Component({
    tag: "ionx-test"
})
export class Test implements ComponentInterface {

    columns: DataTableColumn[];

    rows: any[][];

    componentWillLoad() {

        this.columns = [];
        for (let i = 0; i < 10; i++) {
            this.columns.push({
                id: `${i}`,
                label: `Kol ${i}`,
                sortingEnabled: i === 3 || i === 0,
                filterEnabled: i === 3 || i === 0,
                filterType: i === 3 ? "select" : (i === 0 ? "search" : undefined)
            });
        }

        this.rows = [];
        for (let i = 0; i < 100; i++) {
            const row = [];
            for (let c = 0; c < 10; c++) {
                row.push(c === 3 ? (Math.ceil(i / 10)) : `${i}${c}`);
            }
            this.rows.push(row);
        }

    }

    render() {
        return <ion-content>
            <ionx-data-table columns={this.columns} data={this.rows} style={{"margin": "16px"}}/>
        </ion-content>
    }
}
