import {Capacitor} from "@capacitor/core";
import {intl, MessageRef} from "@co.mmons/js-intl";
import {sleep} from "@co.mmons/js-utils/core";
import {isPlatform} from "@ionic/core";
import {Component, ComponentInterface, Element, h, Host, Listen, Prop, State} from "@stencil/core";
import {matchesMediaBreakpoint} from "../misc/matchesMediaBreakpoints";
import {indexAttribute} from "./indexAttribute";
import {isEqualValue} from "./isEqualValue";
import {SelectOption} from "./SelectOption";
import {ValueComparator} from "./ValueComparator";


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
    orderable: boolean;

    @Prop()
    searchTest: (query: string, value: any, label: string) => boolean;

    @Prop()
    options: SelectOption[];

    @State()
    visibleOptions: SelectOption[];

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

    virtualItemHeight: number;

    useVirtualScroll: boolean;

    @State()
    didEnter = false;

    async search(ev: CustomEvent) {
        const query = ev.detail.value?.toLocaleLowerCase() ?? undefined;

        if (query) {

            const options = [];

            for (let i = 0; i < this.options.length; i++) {
                if (!this.options[i].divider) {

                    const label = (this.options[i].label instanceof MessageRef ? intl.message(this.options[i].label) : this.options[i].label) || (this.labelFormatter ? this.labelFormatter(this.options[i].value) : `${this.options[i].value}`);

                    if (this.searchTest) {
                        if (!this.searchTest(query, this.options[i].value, label)) {
                            continue;
                        }

                    } else if ((label || "").toLowerCase().indexOf(query) < 0) {
                        continue;
                    }

                    // search for parent divider
                    for (let ii = i - 1; ii >= 0; ii--) {
                        if (this.options[ii].divider) {
                            options.push(this.options[ii]);
                            break;
                        }
                    }

                    options.push(this.options[i]);
                }
            }

            this.visibleOptions = options;

        } else {
            this.visibleOptions = this.options.slice();
        }

    }

    @Listen("ionViewDidEnter")
    async onDidEnter() {

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

        const indexToSelect = (this.values.length > 0 && this.options.findIndex(option => this.values.findIndex(v => isEqualValue(option.value, v, this.comparator)) > -1)) || -1;
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
                this.element.querySelector(`ion-item[${indexAttribute}="${index - 1}"]`)?.scrollIntoView();
            }
        }
    }

    onClick(ev: MouseEvent, option: SelectOption) {

        const wasChecked = this.values.findIndex(value => isEqualValue(value, option.value, this.comparator)) > -1;

        if (!this.empty && this.values.length === 1 && wasChecked) {
            (ev.target as HTMLIonCheckboxElement).checked = true;
            ev.preventDefault();
            ev.stopImmediatePropagation();
            ev.stopPropagation();
            return;
        }

        this.onCheck(option, !wasChecked);
    }

    onCheck(option: SelectOption, checked: boolean) {

        const valuesBefore = this.values.slice();

        VALUES: {

            for (let i = 0; i < this.values.length; i++) {

                if (isEqualValue(this.values[i], option.value, this.comparator)) {

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
                    this.values.push(option.value);
                } else {
                    this.values = [option.value];
                }
            }
        }

        if (this.multiple && this.checkValidator) {
            this.values = this.checkValidator(option.value, checked, valuesBefore) || [];
        }

        if (!this.multiple) {
            this.ok();
        }

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

        if (!this.orderable) {
            this.values.sort((a, b) => this.options.findIndex(o => isEqualValue(o.value, a, this.comparator)) - this.options.findIndex(o => isEqualValue(o.value, b, this.comparator)));
        }

        if (this.overlay === "modal") {
            const modal = this.element.closest<HTMLIonModalElement>("ion-modal");
            modal.dismiss(this.values, "ok");
        } else {
            const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
            popover.dismiss(this.values, "ok");
        }

    }

    connectedCallback() {
        this.useVirtualScroll = this.overlay === "modal" && this.options.length > 100;
        this.visibleOptions = this.options.slice();
    }

    renderItem(option: SelectOption, index: number) {

        if (!option) {
            return;
        }

        return <ion-item key={index} {...{[indexAttribute]: index}}>

            <ion-checkbox
                class="sc-ionx-select-overlay"
                slot="start"
                checked={this.values.findIndex(v => isEqualValue(v, option.value, this.comparator)) > -1}
                onClick={ev => this.onClick(ev, option)}/>

            <ion-label>{option.label ?? (this.labelFormatter ? this.labelFormatter(option.value) : `${option.value}`)}</ion-label>

        </ion-item>
    }

    render() {

        return <Host>

            {this.useVirtualScroll && !this.didEnter && <div style={{visibility: "hidden"}}>{this.renderItem(this.options.find(o => !o.divider), 0)}</div>}

            {this.overlay === "modal" && <ion-header>
                <ion-toolbar>

                    <ion-back-button
                        style={{display: "inline-block"}}
                        icon={matchesMediaBreakpoint(this, "md") ? "close" : null}
                        onClick={ev => [ev.preventDefault(), this.cancel()]}
                        slot="start"/>

                    <ion-title style={{padding: "0px"}}>{this.overlayTitle}</ion-title>

                    <ion-buttons slot="end">
                        <ion-button fill="clear" onClick={() => this.ok()}>{intl.message`@co.mmons/js-intl#Done`}</ion-button>
                    </ion-buttons>

                </ion-toolbar>

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

                <ion-list lines="full">

                    {this.didEnter && this.useVirtualScroll && <ion-virtual-scroll
                        items={this.visibleOptions}
                        approxItemHeight={this.virtualItemHeight}
                        renderItem={(item, index) => this.renderItem(item, index)}/>}

                    {(this.overlay === "popover" || !this.useVirtualScroll) && this.options.map((option, index) => this.renderItem(option, index))}

                </ion-list>

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
