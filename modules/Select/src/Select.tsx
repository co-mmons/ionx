import {StyleEventDetail} from "@ionic/core";
import {Component, Element, Event, EventEmitter, forceUpdate, Fragment, FunctionalComponent, h, Host, Listen, Method, Prop, Watch} from "@stencil/core";
import {deepEqual} from "fast-equals";
import type Sortable from "sortablejs";
import {findValueItem} from "./findValueItem";
import {LazyItemsFn} from "./LazyItemsFn";
import {SelectLazyGroupItem} from "./SelectGroupItem";
import {SelectItem} from "./SelectItem";
import {SelectOverlayProps} from "./SelectOverlayProps";
import {SelectValueItem} from "./SelectValueItem";
import {showSelectOverlay} from "./showSelectOverlay";
import {sortableItemClass} from "./sortableItemClass";
import {ValueComparator} from "./ValueComparator";
import {valueLabel} from "./valueLabel";

let instanceCounter = 0;

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
    overlayOptions: {whiteSpace?: "nowrap" | "normal", title?: string};

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
     * If multiple values selection can be sorted after selection.
     */
    @Prop()
    sortable: boolean;

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

    /**
     * @deprecated
     */
    @Prop()
    options: SelectItem[];

    @Prop()
    items: SelectItem[];

    @Prop()
    lazyItems: LazyItemsFn | SelectLazyGroupItem;

    @Prop()
    labelComponent?: string | FunctionalComponent<{value: any, item?: SelectItem, label: string, index: number, readonly?: boolean}>;

    @Prop()
    labelFormatter?: (value: any) => string;

    @Prop()
    separator?: string = ", ";

    @Prop({mutable: true})
    value: any;

    @Event()
    ionChange: EventEmitter<{value: any}>;

    @Event()
    ionFocus: EventEmitter<any>;

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

    sortableInstance: Sortable;

    readonly internalId = ++instanceCounter;

    /**
     * Always returns value as array. If value is undefined, empty array is returned.
     */
    get valueAsArray() {
        return Array.isArray(this.value) ? this.value : (this.value !== undefined ? [this.value] : []);
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

    @Watch("sortable")
    @Watch("multiple")
    async configureSortable() {

        if (this.sortable && this.multiple) {
            const prevInstance = this.sortableInstance;
            this.sortableInstance = (await import("./initSortable")).initSortable.call(this);

            if (prevInstance && prevInstance !== this.sortableInstance) {
                prevInstance.destroy();
            }

        } else if (this.sortableInstance) {
            this.sortableInstance.destroy();
            this.sortableInstance = undefined;
        }

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

        this.configureSortable();
    }

    renderValue(values: any[], value: any, index: number) {

        const LabelComponent = this.labelComponent;
        const ValueComponent = this.sortable ? "ion-chip" : "span";

        const item = findValueItem(this.visibleItems, value, this.comparator);
        const label = valueLabel(this.visibleItems, value, {comparator: this.comparator, formatter: this.labelFormatter});

        return <Fragment>

            <ValueComponent key={value} {...(ValueComponent === "ion-chip" ? {outline: true} : {})} class={{[sortableItemClass]: true}}>

                {!!LabelComponent && <LabelComponent
                    value={value}
                    item={item}
                    label={label}
                    index={index}
                    readonly={this.readonly}/>}

                {!LabelComponent && <span>{label}{!this.sortable && index < values.length - 1 ? this.separator : ""}</span>}

            </ValueComponent>

            {!this.readonly && !this.disabled && this.multiple && this.sortable && index === values.length - 1 && <ion-chip key="more">
                <ion-icon name="ellipsis-horizontal" style={{margin: "0px"}}/>
            </ion-chip>}

        </Fragment>
    }

    render() {

        const values = this.valueAsArray;
        const empty = values.length === 0;

        return <Host
            role="combobox"
            aria-haspopup="dialog"
            class={{
                "ionx--sortable": this.sortable && !empty && !this.disabled && !this.readonly,
                "ionx--readonly": !!this.readonly,
                "ionx--disabled": !!this.disabled
            }}
            onClick={() => this.open()}>

            <div class="ionx--inner">

                {this.loading && <ion-spinner name="dots"/>}

                {!this.loading && <Fragment>

                    <div class={{
                        "ionx--text": true,
                        "ionx--placeholder-visible": empty && !!this.placeholder
                    }}>

                        {empty && this.placeholder && <span>{this.placeholder}</span>}

                        {values.map((value, index) => this.renderValue(values, value, index))}

                    </div>

                    {!this.readonly && !this.disabled && <Fragment>

                        {(!this.sortable || empty) && <div class="ionx--icon" role="presentation">
                            <div class="ionx--icon-inner"/>
                        </div>}

                    </Fragment>}

                </Fragment>}

            </div>

        </Host>;
    }

}
