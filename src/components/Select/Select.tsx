import {modalController, OverlayEventDetail, popoverController, StyleEventDetail} from "@ionic/core";
import {Component, Element, Event, EventEmitter, Fragment, h, Host, Prop, State, Watch} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {indexAttribute} from "./indexAttribute";
import {SelectOption} from "./SelectOption";
import {ValueComparator} from "./ValueComparator";
import {valueLabel} from "./valueLabel";

@Component({
    tag: "ionx-select",
    styleUrl: "Select.scss",
    scoped: true
})
export class Select {

    @Element()
    element: HTMLElement;

    @Prop()
    placeholder: string;

    @Prop()
    overlay: "popover" | "modal";

    @Prop()
    overlayTitle: string;

    @Prop()
    overlayOptions: { whiteSpace?: "nowrap" | "normal", title?: string };

    /**
     * Whether value should be always returned as array, no matter if multiple is set to true.
     */
    @Prop()
    alwaysArray: boolean;

    @Prop()
    comparator: ValueComparator;

    /**
     * If multiple value selection is allowed.
     */
    @Prop()
    multiple: boolean;

    /**
     * If multiple values selection can be ordered after selection.
     */
    @Prop()
    orderable: boolean;

    @Prop()
    empty: boolean = true;

    @Prop()
    readonly: boolean = false;

    @Prop()
    disabled: boolean = false;

    @Watch("disabled")
    protected disabledChanged() {
        this.emitStyle();
    }
    /**
     * A function, that will be used for testing if value passes search critieria.
     * Default implementation checks lowercased label of value against
     * lowercased searched text.
     */
    @Prop()
    searchTest: (query: string, value: any, label: string) => boolean;

    @Prop()
    checkValidator: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];

    @Event()
    ionChange: EventEmitter<any>;

    @Prop({mutable: true})
    options: SelectOption[];

    @Prop()
    lazyOptions: () => Promise<SelectOption[]>;

    labelComponent?: string;

    @Prop()
    labelFormatter?: (value: any) => string;

    @Prop()
    separator?: string = ", ";

    @State()
    values: any[] = [];

    @Prop()
    value: any;

    @Watch("value")
    valueChanged(niu: any) {
        this.changeValues(Array.isArray(niu) ? niu : (niu === undefined || niu === null ? [] : [niu]));
    }

    /**
     * Emitted when the styles change.
     * @internal
     */
    @Event()
    ionStyle!: EventEmitter<StyleEventDetail>;

    private changeValues(values: any[]) {

        if (!deepEqual(this.values, values)) {
            this.values = values.slice();
            this.emitStyle();
        }
    }

    private emitStyle() {

        this.ionStyle.emit({
            "interactive": true,
            "input": true,
            "has-placeholder": this.placeholder != null,
            "has-value": this.values.length > 0,
            // "has-focus": this.hasFocus,
            "interactive-disabled": this.disabled,
        });
    }

    async open(event: Event) {

        const overlay: "popover" | "modal" = this.overlay || "popover";

        //
        // let options: SelectOverlayOption[] = [];
        // if (this.options instanceof SelectOptions) {
        //     for (const option of this.options) {
        //         const valueIndex = option.value ? this.indexOfValue(option.value) : -1;
        //         options.push({value: option.value, checked: option.value ? valueIndex > -1 : false, checkedTimestamp: this.orderable && valueIndex, label: option.label ? option.label : ((!this.searchTest || !this.labelTemplate) ? this.labelImpl$(option.value) : undefined), disabled: option.disabled, divider: option.divider});
        //     }
        //
        // } else if (this.options) {
        //     for (const option of this.options) {
        //         const valueIndex = this.indexOfValue(option);
        //         options.push({value: option, checked: valueIndex > -1, checkedTimestamp: this.orderable && valueIndex, label: !this.labelTemplate || !this.searchTest ? this.labelImpl$(option) : undefined});
        //     }
        //
        // } else if (this.optionsComponents) {
        //     for (const option of this.optionsComponents.toArray()) {
        //         const valueIndex = this.indexOfValue(option.value);
        //         options.push({value: option.value, checked: valueIndex > -1, checkedTimestamp: this.orderable && valueIndex, label: option.label, divider: !!option.divider});
        //     }
        // }

        let overlayTitle: string;
        if (this.overlayTitle) {
            overlayTitle = this.overlayTitle;
        }

        if (!overlayTitle) {
            const ionItem = this.element.closest("ion-item");
            if (ionItem) {
                const titleElement = ionItem.querySelector<HTMLElement>("ionx-select-overlay-title");
                if (titleElement) {
                    overlayTitle = titleElement.innerText;
                } else {
                    const label = ionItem.querySelector<HTMLElement>("ion-label");
                    if (label) {
                        overlayTitle = label.innerText;
                    }
                }
            }
        }

        if (!overlayTitle && this.element.title) {
            overlayTitle = this.element.title;
        }

        if (!overlayTitle && this.placeholder) {
            overlayTitle = this.placeholder;
        }

        const overlayData = {
            overlay,
            options: this.options,
            values: this.values.slice(),
            multiple: !!this.multiple,
            overlayTitle: overlayTitle,
            comparator: this.comparator,
            labelComponent: this.labelComponent,
            labelFormatter: this.labelFormatter,
            orderable: !!this.orderable,
            empty: !!this.empty,
            searchTest: this.searchTest,
            // whiteSpace: this.overlayWhiteSpace,
            checkValidator: this.checkValidator,
            width: this.element.getBoundingClientRect().width,
            updateValues: this.changeValues.bind(this)
        };

        let result: OverlayEventDetail<any[]>;

        if (overlay === "popover") {
            const popover = await popoverController.create({component: "ionx-select-overlay", componentProps: overlayData, event});
            popover.present();

            result = await popover.onWillDismiss();

        } else {
            const modal = await modalController.create({component: "ionx-select-overlay", componentProps: overlayData});
            modal.present();
            result = await modal.onWillDismiss();
        }

        if (result.role === "ok") {
            this.changeValues(result.data);
        }
    }

    connectedCallback() {
        this.valueChanged(this.value);
    }

    render() {

        const LabelComponent = this.labelComponent;
        const ValueComponent = this.orderable ? "ion-chip" : "span";

        const length = this.values.length;

        return <Host class={{"ionx--orderable": this.orderable && !this.disabled && !this.readonly}}>

            {this.orderable && <ionx-select-orderable enabled={!this.readonly && !this.disabled} values={this.values} onOrderChanged={ev => this.values = ev.detail}/>}

            <div class="ionx--inner">

                <div class={{
                    "ionx--text": true,
                    "ionx--placeholder-visible": length === 0 && !!this.placeholder
                }}>
                    {length === 0 && this.placeholder && <span>{this.placeholder}</span>}

                    {this.values.map((value, index) => <Fragment>

                        <ValueComponent key={value} outline={true} {...{[indexAttribute]: index}}>

                            {!!LabelComponent ? <LabelComponent value={value} index={index}/> :
                                <span>{valueLabel(this.options, value, {comparator: this.comparator, formatter: this.labelFormatter})}{!this.orderable && index < length - 1 ? this.separator : ""}</span>}

                        </ValueComponent>

                        {!this.readonly && !this.disabled && this.multiple && this.orderable && index === length - 1 && <ion-chip onClick={ev => this.open(ev)}><ion-icon name="ellipsis-horizontal" style={{margin: "0px"}}/></ion-chip>}

                    </Fragment>)}

                </div>

                {!this.readonly && !this.disabled && <Fragment>

                    {!this.orderable && <div class="ionx--icon" role="presentation">
                        <div class="ionx--icon-inner"/>
                    </div>}

                    {(!this.orderable || !this.values || length === 0) &&
                        <button type="button" role="combobox" aria-haspopup="dialog" class="ionx--cover" onClick={ev => this.open(ev)}/>}

                </Fragment>}

            </div>

        </Host>;
    }

}
