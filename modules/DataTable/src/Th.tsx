import {popoverController} from "@ionic/core";
import {Component, Element, h, Host, Prop, State} from "@stencil/core";
import {defineIonxSelect, SelectOption, showSelectOverlay} from "ionx/Select";
import {DataTableColumnFilterOptions} from "./DataTableColumnFilterOptions";
import {Filter} from "./filter/Filter";
import {HasOneOfFilter} from "./filter/HasOneOfFilter";
import {MatchStringFilter} from "./filter/MatchStringFilter";

defineIonxSelect();

@Component({
    tag: "ionx-data-table-th",
    styleUrl: "Th.scss",
    scoped: true
})
export class Th implements DataTableColumnFilterOptions {

    @Element()
    element: HTMLElement;

    @Prop()
    filterEnabled: boolean;

    @Prop()
    filterType: DataTableColumnFilterOptions.FilterType;

    @Prop()
    filterData: () => any[];

    @Prop()
    filterApply: (filter: Filter) => any | void;

    /**
     * Returns currently applied filter for given column.
     */
    @Prop()
    filterCurrent: () => Filter;

    @State()
    filterActive: boolean;

    dataTable() {
        return this.element.closest("ionx-data-table");
    }

    async filterClicked() {

        if (this.filterType === "select") {
            await this.filterSelect();
        } else if (this.filterType === "search") {
            await this.filterSearch();
        }
    }

    async filterSearch() {

        const current = this.filterCurrent();

        const popover = await popoverController.create({
            component: "ionx-data-table-search-filter",
            componentProps: {
                value: current instanceof MatchStringFilter ? current.value : undefined
            },
            event: {target: this.element.querySelector("ion-button")} as any
        });

        await popover.present();

        const result = await popover.onWillDismiss();
        if (result.role === "ok") {
            const value = (result.data as string)?.trim();
            this.filterApply(value ? new MatchStringFilter(value) : undefined);
            this.filterActive = !!value;
        }
    }

    async filterSelect() {

        const current = this.filterCurrent();

        const overlayTitle = this.element.querySelector<HTMLElement>("[slot-container=label]").innerText || this.element.title;
        const options: SelectOption[] = this.filterData().map(data => ({label: data, value: data}));

        const {willDismiss} = await showSelectOverlay({
            overlay: "modal",
            multiple: true,
            empty: true,
            overlayTitle,
            options,
            values: current instanceof HasOneOfFilter ? current.values : []
        });

        const result = await willDismiss;
        if (result.role === "ok") {
            this.filterApply(result.data.length === 0 ? undefined : new HasOneOfFilter(result.data));
            this.filterActive = result.data.length > 0;
        }
    }

    render() {
        return <Host>
            <div class="ionx--outer">

                <div slot-container="label">
                    <slot/>
                </div>

                {this.filterEnabled && <ion-button
                    fill="clear"
                    size="small"
                    shape="round"
                    color={this.filterActive ? "success" : "primary"}
                    onClick={() => this.filterClicked()}>
                    <ion-icon name={this.filterType === "search" ? "search" : "filter"}/>
                </ion-button>}

            </div>
        </Host>;
    }
}
