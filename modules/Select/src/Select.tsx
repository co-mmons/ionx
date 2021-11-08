import {ItemReorderEventDetail, StyleEventDetail} from "@ionic/core";
import {Component, Element, Event, EventEmitter, forceUpdate, Fragment, FunctionalComponent, h, Host, Listen, Method, Prop, Watch} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {prefetchComponent} from "ionx/utils";
import {findValueItem} from "./findValueItem";
import {SelectLazyGroupItem} from "./SelectGroupItem";
import {SelectItem} from "./SelectItem";
import {SelectOverlayProps} from "./SelectOverlayProps";
import {SelectProps} from "./SelectProps";
import {SelectValueItem} from "./SelectValueItem";
import {showSelectOverlay} from "./showSelectOverlay";
import {ValueComparator} from "./ValueComparator";
import {valueLabel} from "./valueLabel";

let instanceCounter = 0;

@Component({
    tag: "ionx-select",
    styleUrl: "Select.scss",
    scoped: true
})
export class Select implements SelectProps {

    @Element()
    element: HTMLElement;

    /**
     * @inheritDoc
     */
    @Prop()
    placeholder: string;

    /**
     * @inheritDoc
     */
    @Prop()
    overlay: SelectProps.Overlay;

    /**
     * @inheritDoc
     */
    @Prop()
    overlayTitle: string;

    /**
     * @inheritDoc
     */
    @Prop()
    overlayOptions: SelectProps.OverlayOptions;

    /**
     * @inheritDoc
     */
    @Prop()
    alwaysArray: boolean;

    /**
     * @inheritDoc
     */
    @Prop()
    comparator: ValueComparator;

    /**
     * @inheritDoc
     */
    @Prop()
    multiple: boolean;

    /**
     * @inheritDoc
     */
    @Prop()
    sortable: boolean;

    /**
     * @inheritDoc
     */
    @Prop()
    empty: boolean = true;

    /**
     * @inheritDoc
     */
    @Prop()
    readonly: boolean = false;

    /**
     * @inheritDoc
     */
    @Prop()
    disabled: boolean = false;

    /**
     * @inheritDoc
     */
    @Prop()
    searchTest: SelectProps.SearchTestFn;

    /**
     * @inheritDoc
     */
    @Prop()
    checkValidator: SelectProps.CheckValidatorFn;

    /**
     * @deprecated
     */
    @Prop()
    options: SelectItem[];

    /**
     * @inheritDoc
     */
    @Prop()
    items: SelectItem[];

    /**
     * @inheritDoc
     */
    @Prop()
    lazyItems: SelectProps.LazyItemsFn | SelectLazyGroupItem;

    /**
     * @inheritDoc
     */
    @Prop()
    labelComponent?: string | FunctionalComponent<SelectProps.LabelComponentProps>;

    /**
     * @inheritDoc
     */
    @Prop()
    labelFormatter?: SelectProps.LabelFormatterFn;

    /**
     * @inheritDoc
     */
    @Prop()
    separator?: string = ", ";

    /**
     * @inheritDoc
     */
    @Prop({mutable: true})
    value: any;

    @Event()
    ionChange: EventEmitter<{value: any}>;

    @Event()
    ionFocus: EventEmitter<any>;

    /**
     * @internal
     */
    @Prop()
    prefetch: boolean;

    /**
     * Emitted when the styles change.
     * @internal
     */
    @Event()
    ionStyle!: EventEmitter<StyleEventDetail>;

    visibleItems: SelectValueItem[];

    valueChanging: boolean;

    focused: boolean;

    loading: boolean;

    readonly internalId = ++instanceCounter;

    /**
     * Always returns value as array. If value is undefined, empty array is returned.
     */
    get valueAsArray() {
        return Array.isArray(this.value) ? this.value : (this.value !== undefined ? [this.value] : []);
    }

    @Watch("disabled")
    protected disabledChanged() {
        this.emitStyle();
    }

    @Watch("options")
    optionsChanged(niu: SelectItem[]) {
        this.items = niu;
    }

    @Watch("value")
    async valueChanged(niu: any, old: any) {

        if (this.valueChanging) {
            if (!deepEqual(niu, old)) {
                this.ionChange.emit({value: this.value});
            }
        } else {
            this.buildVisibleItems();
        }

        this.valueChanging = false;
        this.emitStyle();
    }

    @Method()
    async setFocus(options?: FocusOptions): Promise<void> {
        this.element.focus(options);
    }

    @Method()
    async setBlur(): Promise<void> {
        this.element.blur();
    }

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

    private emitStyle() {

        this.ionStyle.emit({
            "interactive": !this.disabled && !this.readonly,
            "input": true,
            "has-placeholder": this.placeholder != null,
            "has-value": this.valueAsArray?.length > 0,
            "has-focus": this.focused,
            "interactive-disabled": this.disabled,
        });
    }

    async buildVisibleItems() {

        let visible: SelectValueItem[] = [];

        // values, that do not match items
        const unmatched: any[] = [];

        for (const value of this.valueAsArray) {
            const item = findValueItem([].concat(this.items ?? [], this.visibleItems ?? []), value, this.comparator);
            if (item) {
                visible.push(item);
            } else {
                unmatched.push(value);
            }
        }

        if (unmatched.length > 0) {
            this.loading = true;

            if (this.lazyItems) {
                visible = await (typeof this.lazyItems === "function" ? this.lazyItems(this.valueAsArray) : this.lazyItems.items(this.valueAsArray)) as SelectValueItem[];

            } else if (this.items) {

                for (const item of this.items) {
                    if (unmatched.length > 0 && item.group) {

                        const subitems = typeof item.items === "function" ? await item.items(unmatched) : item.items;

                        if (subitems) {
                            for (let i = unmatched.length - 1; i >= 0; i--) {
                                const subitem = findValueItem(subitems, unmatched[i], this.comparator);
                                if (subitem) {
                                    visible = (visible ?? []).concat([subitem]);
                                    unmatched.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            }
        }

        this.visibleItems = visible;
        this.loading = false;

        forceUpdate(this);
    }

    async open() {

        const overlay: "popover" | "modal" = this.overlay || "popover";

        let overlayTitle: string;
        if (this.overlayTitle) {
            overlayTitle = this.overlayTitle;
        }

        if (!overlayTitle) {
            const ionItem = this.element.closest("ion-item");
            if (ionItem) {
                const titleElement = ionItem.querySelector<HTMLElement>("ionx-select-title");
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

        const overlayProps: SelectOverlayProps = {
            overlay,
            items: this.items?.slice(),
            lazyItems: this.lazyItems ? (() => typeof this.lazyItems === "function" ? this.lazyItems() : this.lazyItems?.items()) : undefined,
            values: this.valueAsArray.slice() ?? [],
            multiple: !!this.multiple,
            overlayTitle: overlayTitle,
            comparator: this.comparator,
            labelFormatter: this.labelFormatter,
            sortable: !!this.sortable,
            empty: !!this.empty,
            searchTest: this.searchTest,
            // whiteSpace: this.overlayWhiteSpace,
            checkValidator: this.checkValidator
        };

        const {willDismiss, didDismiss} = await showSelectOverlay(overlayProps, {target: this.element} as any);

        const result = await willDismiss;
        if (result.role === "ok") {
            this.valueChanging = true;

            const {values, items} = result.data;

            this.visibleItems = items;

            if (this.multiple || this.alwaysArray) {
                this.value = values;
            } else {
                this.value = values.length > 0 ? values[0] : undefined;
            }
        }

        await didDismiss;

        this.setFocus();
    }

    valuesReorder(ev: CustomEvent<ItemReorderEventDetail>) {
        ev.preventDefault();

        const values = this.valueAsArray.slice();
        const value = values[ev.detail.from];

        values.splice(ev.detail.from, 1);
        values.splice(ev.detail.to, 0, value);

        this.valueChanging = true;
        this.value = values;

        ev.detail.complete(true);
    }

    componentDidLoad() {
        prefetchComponent({delay: 0}, "ion-reorder-group", "ion-item", "ion-label", "ion-spinner", "ion-reorder");
    }

    connectedCallback() {

        if (!this.items && this.options) {
            this.items = this.options;
        }

        this.emitStyle();
        this.buildVisibleItems();

        if (!this.element.hasAttribute("tabIndex")) {
            this.element.setAttribute("tabIndex", "0");
        }
    }

    renderValue(values: any[], value: any, index: number) {

        const sortable = this.sortable && this.multiple;
        const LabelComponent = this.labelComponent;
        const DefaultLabelComponent = sortable ? "ion-label" : "span";
        const ValueComponent = sortable ? "ion-item" : "span";

        const item = findValueItem(this.visibleItems, value, this.comparator);
        const label = valueLabel(this.visibleItems, value, {comparator: this.comparator, formatter: this.labelFormatter});

        return <Fragment>

            <ValueComponent key={value}>

                {!!LabelComponent && <LabelComponent
                    value={value}
                    item={item}
                    label={label}
                    index={index}
                    readonly={this.readonly}/>}

                {!LabelComponent && <DefaultLabelComponent>{label}{!sortable && index < values.length - 1 ? this.separator : ""}</DefaultLabelComponent>}

                {sortable && !this.readonly && !this.disabled && <ion-reorder slot="end"/>}

            </ValueComponent>

        </Fragment>
    }

    render() {

        if (this.prefetch) {
            return;
        }

        const values = this.valueAsArray;
        const empty = values.length === 0;
        const sortable = this.sortable && this.multiple;

        return <Host
            role="combobox"
            aria-haspopup="dialog"
            class={{
                "ionx--sortable": this.sortable && !empty && !this.disabled && !this.readonly,
                "ionx--readonly": !!this.readonly,
                "ionx--disabled": !!this.disabled,
                "ion-activatable": !this.readonly && !this.disabled
            }}
            onClick={() => this.open()}>

            <div class="ionx--inner">

                <slot name="icon"/>

                {this.loading && <ion-spinner name="dots"/>}

                {!this.loading && <Fragment>

                    {(!sortable || empty) && <div class={{
                        "ionx--text": true,
                        "ionx--placeholder-visible": empty && !!this.placeholder
                    }}>

                        {empty && this.placeholder && <span>{this.placeholder}</span>}

                        {values.map((value, index) => this.renderValue(values, value, index))}

                    </div>}

                    {!this.readonly && !this.disabled && (!sortable || empty) && <div class="ionx--dropdown" role="presentation">
                        <div class="ionx--dropdown-inner"/>
                    </div>}

                    {sortable && !empty && <ion-reorder-group onIonItemReorder={ev => this.valuesReorder(ev)} disabled={this.readonly || this.disabled}>
                        {values.map((value, index) => this.renderValue(values, value, index))}
                    </ion-reorder-group>}

                </Fragment>}

            </div>

        </Host>;
    }

}
