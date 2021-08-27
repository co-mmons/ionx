import {Capacitor} from "@capacitor/core";
import {intl, MessageRef} from "@co.mmons/js-intl";
import {sleep, waitTill} from "@co.mmons/js-utils/core";
import {isPlatform} from "@ionic/core";
import {Component, ComponentInterface, Element, forceUpdate, h, Host, Listen, Prop, State} from "@stencil/core";
import {defineIonxLoading} from "ionx/Loading";
import {defineIonxToolbar} from "ionx/Toolbar";
import {waitTillHydrated} from "ionx/utils";
import {findValueItem} from "./findValueItem";
import {isEqualValue} from "./isEqualValue";
import {SelectDividerItem} from "./SelectDividerItem";
import {SelectGroupItem} from "./SelectGroupItem";
import {SelectItem} from "./SelectItem";
import {SelectValueItem} from "./SelectValueItem";
import {ValueComparator} from "./ValueComparator";

defineIonxToolbar();
defineIonxLoading();

const indexAttribute = "ionx-select--idx";

@Component({
    tag: "ionx-select-overlay",
    styleUrl: "SelectOverlay.scss",
    scoped: true
})
export class SelectOverlay implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    overlay!: "modal" | "popover";

    @Prop()
    overlayTitle: string;

    @Prop()
    sortable: boolean;

    @Prop()
    searchTest: (query: string, value: any, label: string) => boolean;

    @Prop({mutable: true})
    items: SelectItem[];

    @Prop()
    lazyItems: () => Promise<Array<SelectValueItem | SelectDividerItem>>;

    @State()
    visibleItems: SelectItem[];

    @Prop()
    multiple: boolean;

    @Prop({mutable: true})
    values: any[];

    @Prop()
    empty: boolean;

    @Prop()
    comparator: ValueComparator;

    @Prop()
    checkValidator: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];

    @Prop()
    labelFormatter?: (value: any) => string;

    @State()
    didEnter = false;

    @State()
    expandedGroups: { [groupId: string]: boolean } = {};

    @State()
    loadingGroups: { [groupId: string]: boolean } = {};

    groupsItems: { [groupId: string]: SelectItem[] } = {};

    virtualItemHeight: number;

    useVirtualScroll: boolean;

    async search(ev: CustomEvent) {
        const query = ev.detail.value?.toLocaleLowerCase() || undefined;

        if (query) {

            const items = [];

            for (let i = 0; i < this.items.length; i++) {
                if (!this.items[i].divider) {

                    const label = (this.items[i].label instanceof MessageRef ? intl.message(this.items[i].label) : this.items[i].label) || (this.labelFormatter ? this.labelFormatter(this.items[i].value) : `${this.items[i].value}`);

                    if (this.searchTest) {
                        if (!this.searchTest(query, this.items[i].value, label)) {
                            continue;
                        }

                    } else if ((label || "").toLowerCase().indexOf(query) < 0 && !this.items[i].search?.find(v => v.toLowerCase().indexOf(query) > -1)) {
                        continue;
                    }

                    // search for parent divider or group
                    for (let ii = i - 1; ii >= 0; ii--) {
                        if (this.items[ii].divider) {
                            items.push(this.items[ii]);
                            break;
                        }
                    }

                    items.push(this.items[i]);
                }
            }

            this.visibleItems = items;

        } else {
            this.visibleItems = this.items.slice();
        }

    }

    @Listen("ionViewDidEnter")
    async onDidEnter() {

        if (this.lazyItems) {
            this.items = await this.lazyItems();

        } else {

            // values, that do not match items
            const unloaded: any[] = [];
            for (const value of this.values) {
                if (!findValueItem(this.items ?? [], value, this.comparator)) {
                    unloaded.push(value);
                }
            }

            if (unloaded.length > 0) {
                for (const group of this.items.filter(item => item.group)) {

                    let subitems: SelectItem[];

                    if (group.values?.(unloaded)?.length) {
                        subitems = typeof group.items === "function" ? await group.items() : group.items;
                    } else if (Array.isArray(group.items) && unloaded.find(value => findValueItem(group.items as SelectItem[], value, this.comparator))) {
                        subitems = group.items;
                    }

                    if (subitems) {

                        this.groupsItems[group.id] = subitems;

                        for (let i = 0; i < this.items.length; i++) {
                            if (this.items[i] === group) {
                                this.items.splice(i, 1, group, ...subitems);
                                this.expandedGroups[group.id] = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        this.useVirtualScroll = this.overlay === "modal" && this.items.length > 100;
        this.visibleItems = this.items.slice();

        if (this.useVirtualScroll) {
            let firstItem: HTMLElement;
            while (!firstItem) {
                firstItem = this.element.querySelector(`ion-item[${indexAttribute}]`);
                if (!firstItem) {
                    await sleep(1);
                }
            }

            this.virtualItemHeight = firstItem.getBoundingClientRect().height + 1;
        }

        this.didEnter = true;

        await waitTillHydrated(this.element);

        const indexToSelect = (this.values.length > 0 && this.items.findIndex(option => this.values.findIndex(v => isEqualValue(option.value, v, this.comparator)) > -1)) || -1;
        if (indexToSelect > -1) {
            this.scrollToIndex(indexToSelect);
        }

        if (this.overlay === "modal" && Capacitor.platform === "web" && isPlatform("desktop")) {
            let searchbar: HTMLIonSearchbarElement;
            while (!searchbar) {
                searchbar = this.element.querySelector("ion-searchbar");
                if (!searchbar) {
                    await sleep(1);
                }
            }

            searchbar.setFocus();
        }
    }

    async scrollToIndex(index: number) {
        const content = this.element.querySelector<HTMLIonContentElement>("ion-content");
        if (content) {
            const scroll = await content.getScrollElement();

            while (!this.element.querySelector("ion-list ion-item")) {
                await sleep(1);
            }

            if (this.useVirtualScroll) {
                scroll.scrollTo({top: (index - 1) * this.virtualItemHeight});
            } else {
                let item: HTMLElement;
                try {
                    await waitTill(() => !!(item = this.element.querySelector(`ion-item[${indexAttribute}="${index - 1}"]`)), undefined, 5000);
                    item.scrollIntoView();
                } catch {
                }
            }
        }
    }

    onClick(ev: MouseEvent, item: SelectItem) {

        const wasChecked = this.values.findIndex(value => isEqualValue(value, item.value, this.comparator)) > -1;

        if (!this.empty && this.values.length === 1 && wasChecked) {
            (ev.target as HTMLIonCheckboxElement).checked = true;
            ev.preventDefault();
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            return;
        }

        this.onCheck(item, !wasChecked);
    }

    onCheck(item: SelectItem, checked: boolean) {

        const valuesBefore = this.values.slice();

        VALUES: {

            for (let i = 0; i < this.values.length; i++) {

                if (isEqualValue(this.values[i], item.value, this.comparator)) {

                    if (!checked) {
                        this.values.splice(i, 1);
                    } else {
                        break VALUES;
                    }

                    break;
                }
            }

            if (checked) {
                if (this.multiple) {
                    this.values.push(item.value);
                } else {
                    this.values = [item.value];
                }
            }
        }

        if (this.multiple && this.checkValidator) {
            this.values = this.checkValidator(item.value, checked, valuesBefore) || [];
        }

        if (!this.multiple) {
            this.ok();
        }

    }

    async toggleGroup(group: SelectGroupItem) {

        if (!this.expandedGroups[group.id]) {
            this.expandedGroups[group.id] = true;
            this.loadingGroups[group.id] = true;

            forceUpdate(this);

            const subitems = this.groupsItems[group.id] ?? (typeof group.items === "function" ? await group.items() : group.items);
            if (subitems) {

                this.groupsItems[group.id] = subitems;

                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i] === group) {
                        this.items.splice(i, 1, group, ...subitems);
                        this.visibleItems = this.items.slice();
                        break;
                    }
                }
            }

        } else {

            for (const subitem of this.groupsItems[group.id]) {
                const i = this.items.indexOf(subitem);
                if (i > -1) {
                    this.items.splice(i, 1);
                }
            }

            this.visibleItems = this.items.slice();

            delete this.expandedGroups[group.id];
        }

        delete this.loadingGroups[group.id];

        forceUpdate(this);
    }

    cancel() {

        if (this.overlay === "modal") {
            const modal = this.element.closest<HTMLIonModalElement>("ion-modal");
            modal.dismiss(undefined, "cancel");
        } else {
            const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
            popover.dismiss(undefined, "cancel");
        }

    }

    ok() {

        const items: SelectValueItem[] = [];

        // we build list of items, that are selected
        // when value is not associated with item, we remove given value
        for (let i = this.values.length - 1; i >= 0; i--) {
            const item = findValueItem(this.items, this.values[i], this.comparator);
            if (item) {
                items.push(item);
            } else {
                this.values.splice(i, 1);
            }
        }

        if (!this.sortable) {
            this.values.sort((a, b) => items.findIndex(o => isEqualValue(o.value, a, this.comparator)) - items.findIndex(o => isEqualValue(o.value, b, this.comparator)));
        }

        if (this.overlay === "modal") {
            const modal = this.element.closest<HTMLIonModalElement>("ion-modal");
            modal.dismiss({values: this.values, items}, "ok");
        } else {
            const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
            popover.dismiss({values: this.values, items}, "ok");
        }

    }

    connectedCallback() {
        this.visibleItems = this.items?.slice();
        this.useVirtualScroll = this.overlay === "modal" && this.items?.length > 100;
    }

    renderItem(item: SelectItem, index: number) {

        if (!item) {
            return;
        }

        if (item.group) {
            return <ion-item
                key={`group:${item.id}`}
                button={true}
                detail={true}
                detailIcon={this.expandedGroups[item.id] ? "chevron-up" : "chevron-down"}
                onClick={() => this.toggleGroup(item as SelectGroupItem)}>

                <ion-label>{(item.label ? (item.label instanceof MessageRef ? intl.message(item.label) : item.label) : undefined) ?? (this.labelFormatter ? this.labelFormatter(item.value) : `${item.value}`)}</ion-label>

                {this.loadingGroups[item.id] && <ion-spinner name="dots" slot="end"/>}

            </ion-item>
        }

        return <ion-item key={index} {...{[indexAttribute]: index}} class={{"ionx--divider": item.divider}}>

            {!item.divider && <ion-checkbox
                class="sc-ionx-select-overlay"
                slot="start"
                checked={this.values.findIndex(v => isEqualValue(v, item.value, this.comparator)) > -1}
                onClick={ev => this.onClick(ev, item)}/>}

            <ion-label>{(item.label ? (item.label instanceof MessageRef ? intl.message(item.label) : item.label) : undefined) ?? (this.labelFormatter ? this.labelFormatter(item.value) : `${item.value}`)}</ion-label>

        </ion-item>
    }

    render() {

        return <Host>

            {this.useVirtualScroll && !this.didEnter && <div style={{visibility: "hidden"}}>{this.renderItem(this.items.find(o => !o.divider), 0)}</div>}

            {this.overlay === "modal" && <ion-header>
                <ionx-toolbar
                    button="close"
                    buttonHandler={() => this.cancel()}>

                    <span slot="title">{this.overlayTitle}</span>

                    <ion-button
                        slot="action"
                        fill="clear"
                        onClick={() => this.ok()}>{intl.message`@co.mmons/js-intl#Done`}</ion-button>

                </ionx-toolbar>

                <ion-toolbar>
                    <ion-searchbar
                        type="text"
                        autocomplete="off"
                        placeholder={intl.message`@co.mmons/js-intl#Search`}
                        onIonChange={ev => this.search(ev)}/>
                </ion-toolbar>

            </ion-header>}

            <ion-content scrollY={this.overlay === "modal"} scrollX={false}>

                {!this.didEnter && this.overlay === "modal" && <ionx-loading type="spinner" cover={true} slot="fixed"/>}

                {this.visibleItems && <ion-list lines="full">

                    {this.useVirtualScroll && <ion-virtual-scroll
                        items={this.visibleItems}
                        approxItemHeight={this.virtualItemHeight}
                        renderItem={(item, index) => this.renderItem(item, index)}/>}

                    {(this.overlay === "popover" || !this.useVirtualScroll) && this.visibleItems.map((item, index) => this.renderItem(item, index))}

                </ion-list>}

            </ion-content>

            {this.multiple && this.overlay === "popover" && <ion-footer>
                <ion-toolbar>

                    <div>

                        <ion-button size="small" fill="clear" onClick={() => this.cancel()}>{intl.message`@co.mmons/js-intl#Cancel`}</ion-button>

                        <ion-button size="small" fill="clear" onClick={() => this.ok()}>{intl.message`@co.mmons/js-intl#Ok`}</ion-button>

                    </div>

                </ion-toolbar>
            </ion-footer>}

        </Host>
    }

}
