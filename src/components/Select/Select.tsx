import {modalController, OverlayEventDetail, popoverController, StyleEventDetail} from "@ionic/core";
import {
    Component,
    Element,
    Event,
    EventEmitter,
    Fragment,
    h,
    Host,
    Listen,
    Method,
    Prop,
    State,
    Watch
} from "@stencil/core";
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

    @Prop({mutable: true})
    value: any;

    valueChangeSilent: boolean;

    @Watch("value")
    valueChanged(niu: any) {

        if (!this.valueChangeSilent) {
            this.changeValues(Array.isArray(niu) ? niu : (niu === undefined || niu === null ? [] : [niu]));
        }

         this.valueChangeSilent = false;
    }

    private changeValues(values: any[]) {

        if (!deepEqual(this.values, values)) {
            this.values = values.slice();

            this.valueChangeSilent = true;
            this.value = this.multiple ? values.slice() : (this.values.length > 0 ? this.values[0] : undefined);

            this.emitStyle();
        }
    }

    @Event()
    ionChange: EventEmitter<any>;

    @Event()
    ionFocus: EventEmitter<any>;

    @Method()
    async setFocus(options?: FocusOptions): Promise<void> {
        this.element.focus(options);
    }

    @Method()
    async setBlur(): Promise<void> {
        this.element.blur();
    }

    focused: boolean;

    @Listen("focus")
    onFocus() {
        this.focused = true;
        this.emitStyle();
    }

    @Listen("blur")
    onBlur() {
        this.focused = false;
        this.emitStyle();
    }

    @Listen("click")
    onClick(ev: MouseEvent) {
        this.open(ev);
    }

    /**
     * Emitted when the styles change.
     * @internal
     */
    @Event()
    ionStyle!: EventEmitter<StyleEventDetail>;

    private emitStyle() {

        this.ionStyle.emit({
            "interactive": !this.disabled && !this.readonly,
            "input": true,
            "has-placeholder": this.placeholder != null,
            "has-value": this.values.length > 0,
            "has-focus": this.focused,
            "interactive-disabled": this.disabled,
        });
    }

    async open(event: Event) {

        const overlay: "popover" | "modal" = this.overlay || "popover";

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
            checkValidator: this.checkValidator
        };

        let result: OverlayEventDetail<any[]>;
        let didDismiss: Promise<any>;

        if (overlay === "popover") {
            const popover = await popoverController.create({component: "ionx-select-overlay", componentProps: overlayData, event});
            popover.present();

            result = await popover.onWillDismiss();
            didDismiss = popover.onDidDismiss();

        } else {
            const modal = await modalController.create({component: "ionx-select-overlay", componentProps: overlayData});
            modal.present();
            result = await modal.onWillDismiss();
            didDismiss = modal.onDidDismiss();
        }

        if (result.role === "ok") {
            this.changeValues(result.data);
        }

        await didDismiss;

        this.setFocus();
    }

    connectedCallback() {

        this.valueChanged(this.value);

        if (!this.element.hasAttribute("tabIndex")) {
            this.element.setAttribute("tabIndex", "0");
        }
    }

    render() {

        const LabelComponent = this.labelComponent;
        const ValueComponent = this.orderable ? "ion-chip" : "span";

        const length = this.values.length;

        return <Host
            role="combobox"
            aria-haspopup="dialog"
            class={{
                "ionx--orderable": this.orderable && !this.disabled && !this.readonly,
                "ionx--readonly": !!this.readonly,
                "ionx--disabled": !!this.disabled
            }}>

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

                </Fragment>}

            </div>

        </Host>;
    }

}
