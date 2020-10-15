import {intl} from "@co.mmons/js-intl";
import {TimeZoneDate} from "@co.mmons/js-utils/core";
import {popoverController, StyleEventDetail} from "@ionic/core";
import _default from "@ionic/core/dist/types/global/ionic-global";
import {Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch} from "@stencil/core";
import {DateTimeValue} from "./DateTimeValue";
import {defaultDateFormat, defaultDateTimeFormat} from "./defaultFormats";

@Component({
    tag: "ionx-date-time",
    styleUrl: "DateTimeInput.scss",
    shadow: true
})
export class Loading {

    @Element()
    element: HTMLElement;

    @Prop()
    placeholder: string;

    @Prop()
    dateOnly: boolean;

    /**
     * Whether timezone cannot be changed.
     */
    @Prop()
    timeZoneDisabled: boolean;

    /**
     * Timezone, that will be set, when new value is picked from picker.
     */
    @Prop()
    defaultTimeZone: string;

    @Prop()
    clearButtonVisible: boolean;

    @Prop()
    clearButtonIcon: string;

    @Prop()
    clearButtonText: string;

    @Prop()
    readonly: boolean;

    @Watch("readonly")
    readonlyChanged() {
        this.emitStyle();
    }

    @Prop()
    disabled: boolean;

    @Watch("disabled")
    disabledChanged() {
        this.emitStyle();
    }

    @Prop()
    formatOptions: Intl.DateTimeFormatOptions;

    @Prop({mutable: true})
    value: DateTimeValue;

    @Watch("value")
    valueChanged(niu: DateTimeValue) {

        if (niu instanceof TimeZoneDate) {
            this.normalizedValue = niu;
        } else if (niu instanceof Date) {
            this.normalizedValue = new TimeZoneDate(niu, this.timeZoneDisabled ? undefined : this.defaultTimeZone);
        } else if (typeof niu === "number") {
            this.normalizedValue = new TimeZoneDate(niu, this.timeZoneDisabled ? undefined : this.defaultTimeZone);
        } else {
            this.normalizedValue = undefined;
        }

        this.formattedValue = this.formatValue();

        this.emitStyle();
    }

    @State()
    normalizedValue: TimeZoneDate;

    @State()
    formattedValue: string;

    formatValue() {

        if (this.value) {
            const options = Object.assign({}, this.formatOptions || (this.dateOnly ? defaultDateFormat : defaultDateTimeFormat));

            if (this.normalizedValue.timeZone) {
                options.timeZone = this.normalizedValue.timeZone;

                if (!options.timeZoneName) {
                    options.timeZoneName = "short";
                }
            }

            if (!this.normalizedValue.timeZone) {
                options.timeZone = "UTC";
                options.timeZoneName = undefined;
            }

            if (this.dateOnly) {
                return intl.dateFormat(this.normalizedValue, options);
            } else {
                return intl.dateTimeFormat(this.normalizedValue, options);
            }

        } else {
            return null;
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

    clearValue() {
        this.value = undefined;
    }

    @Method()
    async open(event?: MouseEvent): Promise<void> {

        const overlayProps = {
            value: this.value ?? new Date(),
            dateOnly: !!this.dateOnly
        };

        const popover = await popoverController.create({component: "ionx-date-time-overlay", componentProps: overlayProps, event});
        popover.present();

        const result = await popover.onWillDismiss();
        if (result.role === "ok") {
            this.value = result.data;
        }
    }

    connectedCallback() {

        this.valueChanged(this.value);

        if (!this.element.hasAttribute("tabIndex")) {
            this.element.setAttribute("tabIndex", "0");
        }
    }

    render() {
        return <Host>

            <div class={{
                "ionx--text": true,
                "ionx--placeholder-visible": !this.formattedValue && !!this.placeholder
            }}>{this.formattedValue ?? this.placeholder}</div>

            {this.clearButtonVisible && !this.readonly && !this.disabled && this.value && <ion-button fill="clear" size="small" tabIndex={-1} onMouseDown={ev => this.clearButtonClicked(ev)}>
                <ion-icon name="close" slot={this.clearButtonText ? "start" : "icon-only"}/>
                {this.clearButtonText && <span>{this.clearButtonText}</span>}
            </ion-button>}

        </Host>;
    }
}
