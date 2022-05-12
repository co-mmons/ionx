import {intl} from "@co.mmons/js-intl";
import {LocalDate, NoTimeDate, sleep, TimeZoneDate, timeZoneOffset} from "@co.mmons/js-utils/core";
import {popoverController, StyleEventDetail} from "@ionic/core";
import {Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, Watch} from "@stencil/core";
import {addEventListener, EventUnlisten} from "ionx/utils";
import {DateTimeInputProps} from "./DateTimeInputProps";
import {DateTimeInputType} from "./DateTimeInputType";
import {DateTimeInputValue} from "./DateTimeInputValue";
import {defaultDateTimeFormat, onlyDateDefaultFormat, onlyDateForceFormat} from "./defaultFormats";
import {isDateOnlyType} from "./isDateOnlyType";
import {isDateTimeType} from "./isDateTimeType";
import {isLocalDateTimeType} from "./isLocaleDateTimeType";

@Component({
    tag: "ionx-date-time-input",
    styleUrl: "Input.scss",
    scoped: true
})
export class Input implements DateTimeInputProps {

    @Element()
    element: HTMLElement;

    /**
     * @inheritDoc
     */
    @Prop()
    type!: DateTimeInputType;

    /**
     * @inheritDoc
     */
    @Prop()
    placeholder: string = intl.message`@co.mmons/js-intl#Choose...`;

    /**
     * @inheritDoc
     */
    @Prop({reflect: true})
    readonly: boolean;

    /**
     * @inheritDoc
     */
    @Prop({reflect: true})
    disabled: boolean;

    /**
     * @inheritDoc
     */
    @Prop({mutable: true})
    value: DateTimeInputValue;

    /**
     * @inheritDoc
     */
    @Prop()
    initialValue?: DateTimeInputValue;

    /**
     * @inheritDoc
     */
    @Prop()
    timeZoneDisabled: boolean = false;

    /**
     * @inheritDoc
     */
    @Prop()
    timeZoneRequired: boolean = true;

    /**
     * @inheritDoc
     */
    @Prop()
    defaultTimeZone: string;

    /**
     * @inheritDoc
     */
    @Prop()
    clearButtonVisible: boolean = true;

    /**
     * @inheritDoc
     */
    @Prop()
    clearButtonIcon: string;

    /**
     * @inheritDoc
     */
    @Prop()
    formatOptions: Intl.DateTimeFormatOptions;


    @Event()
    ionChange: EventEmitter<{value: DateTimeInputValue}>;

    @Event()
    ionFocus: EventEmitter<any>;

    /**
     * Emitted when the styles change.
     * @internal
     */
    @Event()
    ionStyle!: EventEmitter<StyleEventDetail>;


    focused: boolean;

    nativePicker: HTMLInputElement;

    overlayVisible: boolean;

    itemClickUnlisten: EventUnlisten;

    valueChanging: boolean;

    @Watch("readonly")
    readonlyChanged() {
        this.emitStyle();
    }

    @Watch("disabled")
    disabledChanged() {
        this.emitStyle();
    }

    @Watch("value")
    valueChanged(value: DateTimeInputValue, old: DateTimeInputValue) {

        if (this.valueChanging && (!!value !== !!old || JSON.stringify(value.toJSON()) !== JSON.stringify(old.toJSON()))) {
            this.ionChange.emit({value});
        }

        this.emitStyle();
        this.valueChanging = false;
    }

    get isDateOnly() {
        return isDateOnlyType(this.type);
    }

    get isDateTime() {
        return isDateTimeType(this.type);
    }

    get isLocalDateTime() {
        return isLocalDateTimeType(this.type);
    }

    formatValue() {

        if (this.value) {
            const {isDateOnly} = this;

            let value = this.value;
            const options = Object.assign({}, (isDateOnly ? onlyDateDefaultFormat : defaultDateTimeFormat), this.formatOptions, (isDateOnly ? onlyDateForceFormat : {}));

            if (isDateOnly) {
                return intl.dateFormat(value.getTime(), options);

            } else {

                if (value instanceof TimeZoneDate) {
                    options.timeZone = value.timeZone ?? this.defaultTimeZone;

                    if (!("timeZoneName" in options)) {
                        options.timeZoneName = "short";
                    }

                } else {
                    options.timeZone = "UTC";
                    options.timeZoneName = undefined;
                }

                return intl.dateTimeFormat(value.getTime(), options);
            }

        } else {
            return null;
        }
    }

    @Method()
    async setFocus(options?: FocusOptions): Promise<void> {
        this.element.focus(options);
    }

    @Method()
    async setBlur(): Promise<void> {
        this.element.blur();
    }

    @Listen("keydown")
    onKeyDown(ev: KeyboardEvent) {
        if (!this.readonly && !this.disabled && (ev.key === "Enter" || ev.key === " ")) {
            ev.preventDefault();
            this.open();
        }
    }

    @Listen("focus")
    onFocus() {
        this.focused = true;
        this.emitStyle();
    }

    @Listen("blur")
    onBlur() {
        if (this.focused && !this.overlayVisible) {
            this.focused = false;
            this.emitStyle();
        }
    }

    @Listen("click")
    onClick(ev: MouseEvent) {

        if (!ev.composedPath().find(t => (t as HTMLElement).tagName === "ION-BUTTON")) {
            this.open();
        }
    }

    emitStyle() {

        this.ionStyle.emit({
            "interactive": !this.disabled && !this.readonly,
            "input": true,
            "has-placeholder": this.placeholder != null,
            "has-value": !!this.value,
            "has-focus": this.focused,
            "interactive-disabled": this.disabled,
        });
    }

    clearButtonClicked(ev: Event) {
        ev.preventDefault();
        this.clearValue();

        if (!this.focused) {
            this.setFocus();
        }
    }

    @Method()
    async clearValue() {
        this.value = undefined;
    }

    @Method()
    async open(): Promise<void> {

        const {isLocalDateTime, isDateTime, isDateOnly} = this;

        if (this.nativePicker) {

            this.nativePicker = document.createElement("input");
            this.nativePicker.type = "date";
            document.body.appendChild(this.nativePicker);
            this.nativePicker.click();


        } else if (!this.nativePicker) {

            let value = this.value || this.initialValue;
            let currentTimeZone: string;

            if (isDateOnly) {
                value = new NoTimeDate(value ?? new Date());

            } else if (isLocalDateTime && !isDateTime) {

                if (value instanceof TimeZoneDate) {
                    value = new LocalDate(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
                } else if (!value) {
                    const now = new Date();
                    value = new LocalDate(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
                }

            } else {

                if (isDateTime && !isLocalDateTime && this.timeZoneRequired && (!value || !(value instanceof TimeZoneDate) || !value.timeZone) && !this.defaultTimeZone) {
                    currentTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
                }

                if (value instanceof LocalDate && this.timeZoneRequired) {
                    value = new TimeZoneDate(value, currentTimeZone);

                } else if (!this.timeZoneRequired) {
                    const now = new Date();
                    value = new TimeZoneDate(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0 , 0), currentTimeZone);

                } else if (!value || !(value instanceof TimeZoneDate) || (!value.timeZone && this.timeZoneRequired)) {
                    value = new TimeZoneDate(value ?? new Date(), currentTimeZone);
                }
            }

            if (value instanceof TimeZoneDate) {
                if (!value.timeZone || value.timeZone === "UTC") {
                    value = new TimeZoneDate(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), 0, 0), value.timeZone);
                } else {
                    value = new TimeZoneDate(value.getTime() + (timeZoneOffset(value.timeZone, value) * -1), value.timeZone);
                }
            }

            value.setUTCSeconds(0, 0);

            const overlayProps = {
                value,
                type: this.type,
                timeZoneDisabled: isDateOnly || (isLocalDateTime && !isDateTime) || !!this.timeZoneDisabled,
                timeZoneRequired: !isDateOnly && !!this.timeZoneRequired
            };

            const popover = await popoverController.create({
                component: "ionx-date-time-input-overlay",
                componentProps: overlayProps,
                event: {target: this.element} as any,
                showBackdrop: true
            });

            popover.style.setProperty("--width", "250px");
            popover.present();

            this.overlayVisible = true;

            const result = await popover.onWillDismiss();
            if (result.role === "ok") {
                this.valueChanging = true;
                this.value = result.data;
            }

            this.overlayVisible = false;
            this.setFocus({preventScroll: true});
        }
    }

    connectedCallback() {

        this.valueChanged(this.value, undefined);

        if (!this.element.hasAttribute("tabIndex")) {
            this.element.setAttribute("tabIndex", "0");
        }

        this.initItemListener();
    }

    disconnectedCallback() {
        this.itemClickUnlisten?.();
        this.itemClickUnlisten = undefined;
    }

    async initItemListener() {

        while (!this.element.parentElement) {
            await sleep(100);
        }

        if (this.element.parentElement.tagName === "IONX-FORM-ITEM") {
            while (!this.element.assignedSlot) {
                await sleep(100);
            }
        }

        const item = this.element.closest("ion-item");
        if (item) {
            this.itemClickUnlisten = addEventListener(item, "click", ev => this.focused && ev.target === item && (this.open() || true));
        }
    }

    render() {

        const {value, placeholder, readonly, disabled, clearButtonVisible} = this;

        return <Host>

            <div class={{
                "ionx--text": true,
                "ionx--placeholder-visible": !value && !!placeholder
            }}>{value ? this.formatValue() : placeholder }</div>

            {!readonly && !disabled && <div class="ionx--icon" role="presentation">
                <div class="ionx--icon-inner"/>
            </div>}

            {clearButtonVisible && !readonly && !disabled && value && <ion-button
                fill="clear"
                size="small"
                tabIndex={-1}
                onClick={ev => this.clearButtonClicked(ev)}>

                <ion-icon name="backspace" slot="icon-only"/>

            </ion-button>}

        </Host>;
    }
}
