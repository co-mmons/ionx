import {intl} from "@co.mmons/js-intl";
import {sleep, TimeZoneDate, timeZoneOffset} from "@co.mmons/js-utils/core";
import {isPlatform, popoverController, StyleEventDetail} from "@ionic/core";
import {Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch} from "@stencil/core";
import {addEventListener, EventUnlisten} from "ionx/utils";
import {DateTimeInputProps} from "./DateTimeInputProps";
import {defaultDateFormat, defaultDateTimeFormat} from "./defaultFormats";

@Component({
    tag: "ionx-date-time",
    styleUrl: "DateTimeInput.scss",
    scoped: true
})
export class DateTimeInput implements DateTimeInputProps {

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
    dateOnly: boolean;

    /**
     * @inheritDoc
     */
    @Prop()
    timeZoneDisabled: boolean;

    /**
     * @inheritDoc
     */
    @Prop()
    defaultTimeZone: string | "current" = "current";

    /**
     * @inheritDoc
     */
    @Prop()
    timeZoneRequired: boolean = true;

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
    @Prop()
    formatOptions: Intl.DateTimeFormatOptions;

    /**
     * @inheritDoc
     */
    @Prop({mutable: true})
    value: TimeZoneDate;

    @Event()
    ionChange: EventEmitter<{value: TimeZoneDate}>;

    @Event()
    ionFocus: EventEmitter<any>;

    /**
     * Emitted when the styles change.
     * @internal
     */
    @Event()
    ionStyle!: EventEmitter<StyleEventDetail>;

    @State()
    formattedValue: string;

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
    valueChanged(value: TimeZoneDate, old: TimeZoneDate) {

        this.formattedValue = this.formatValue();

        if (this.valueChanging && (value !== old || value?.getTime() !== old?.getTime() || value?.timeZone !== old?.timeZone)) {
            this.ionChange.emit({value});
        }

        this.emitStyle();
        this.valueChanging = false;
    }

    formatValue() {

        if (this.value) {
            const options = Object.assign({}, this.formatOptions || (this.dateOnly ? defaultDateFormat : defaultDateTimeFormat));

            if (this.value.timeZone) {
                options.timeZone = this.value.timeZone;

                if (!options.timeZoneName) {
                    options.timeZoneName = "short";
                }

            } else if (this.value instanceof TimeZoneDate && !this.value.timeZone && this.timeZoneRequired && !this.dateOnly) {
                options.timeZoneName = "short";

            } else {
                options.timeZone = "UTC";
                options.timeZoneName = undefined;
            }

            if (this.dateOnly) {
                return intl.dateFormat(this.value, options);
            } else {
                return intl.dateTimeFormat(this.value, options);
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

        if (this.nativePicker) {

            this.nativePicker = document.createElement("input");
            this.nativePicker.type = "date";
            document.body.appendChild(this.nativePicker);
            this.nativePicker.click();


        } else if (!this.nativePicker) {

            let value: TimeZoneDate = this.value;
            let currentTimeZone: string;

            if (this.dateOnly) {
                value = new TimeZoneDate(this.value ?? new Date());

            } else {

                if (this.timeZoneRequired && (!value || !value.timeZone) && (!this.defaultTimeZone || this.defaultTimeZone === "current")) {
                    currentTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
                }

                if (!value && !this.timeZoneRequired) {
                    const now = new Date();
                    value = new TimeZoneDate(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0 , 0), currentTimeZone);
                } else if (!value || (!value.timeZone && this.timeZoneRequired)) {
                    value = new TimeZoneDate(value ?? new Date(), currentTimeZone);
                }
            }

            if (!value.timeZone || value.timeZone === "UTC") {
                value = new TimeZoneDate(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), 0, 0), value.timeZone);
            } else {
                value = new TimeZoneDate(value.getTime() + (timeZoneOffset(value.timeZone, value) * -1), value.timeZone);
            }

            const overlayProps = {
                value,
                dateOnly: !!this.dateOnly,
                timeZoneDisabled: !!this.dateOnly || !!this.timeZoneDisabled,
                timeZoneRequired: !this.dateOnly && !!this.timeZoneRequired
            };

            const popover = await popoverController.create({
                component: "ionx-date-time-overlay",
                componentProps: overlayProps,
                event: {target: this.element} as any,
                showBackdrop: true
            });

            if (isPlatform("mobile")) {
                popover.style.setProperty("--width", "250px");
            }

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
        return <Host>

            <div class={{
                "ionx--text": true,
                "ionx--placeholder-visible": !this.formattedValue && !!this.placeholder
            }}>{this.formattedValue ?? this.placeholder}</div>

            {!this.readonly && !this.disabled && <div class="ionx--icon" role="presentation">
                <div class="ionx--icon-inner"/>
            </div>}

            {this.clearButtonVisible && !this.readonly && !this.disabled && this.value && <ion-button
                fill="clear"
                size="small"
                tabIndex={-1}
                onClick={ev => this.clearButtonClicked(ev)}>

                <ion-icon name="backspace" slot="icon-only"/>

            </ion-button>}

        </Host>;
    }
}
