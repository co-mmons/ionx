import {intl} from "@co.mmons/js-intl";
import {sleep, TimeZoneDate} from "@co.mmons/js-utils/core";
import {popoverController, StyleEventDetail} from "@ionic/core";
import {Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch} from "@stencil/core";
import {addEventListener, EventUnlisten} from "ionx/utils";
import {defaultDateFormat, defaultDateTimeFormat} from "./defaultFormats";

@Component({
    tag: "ionx-date-time",
    styleUrl: "DateTimeInput.scss",
    scoped: true
})
export class DateTimeInput   {

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
    value: TimeZoneDate;

    @Watch("value")
    valueChanged(niu: TimeZoneDate, old: TimeZoneDate, fireEvent = true) {

        this.formattedValue = this.formatValue();

        this.emitStyle();

        if (fireEvent && (niu !== old || niu?.getTime() !== old?.getTime() || niu?.timeZone !== old?.timeZone)) {
            this.ionChange.emit({value: niu});
        }
    }

    @State()
    formattedValue: string;

    formatValue() {

        if (this.value) {
            const options = Object.assign({}, this.formatOptions || (this.dateOnly ? defaultDateFormat : defaultDateTimeFormat));

            if (this.value.timeZone) {
                options.timeZone = this.value.timeZone;

                if (!options.timeZoneName) {
                    options.timeZoneName = "short";
                }
            }

            if (!this.value.timeZone) {
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

    @Listen("keydown")
    onKeyDown(ev: KeyboardEvent) {
        if (!this.readonly && !this.disabled && (ev.key === "Enter" || ev.key === " ")) {
            ev.preventDefault();
            this.open(ev);
        }
    }

    focused: boolean;

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
            this.open(ev);
        }
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

    nativePicker: HTMLInputElement;

    overlayVisible: boolean;

    @Method()
    async open(event?: any): Promise<void> {

        if (this.nativePicker) {

            this.nativePicker = document.createElement("input");
            this.nativePicker.type = "date";
            document.body.appendChild(this.nativePicker);
            this.nativePicker.click();


        } else if (!this.nativePicker) {

            const overlayProps = {
                value: this.value ?? new Date(),
                dateOnly: !!this.dateOnly
            };

            const popover = await popoverController.create({
                component: "ionx-date-time-overlay",
                componentProps: overlayProps,
                event,
                showBackdrop: true
            });
            popover.present();
            this.overlayVisible = true;

            const result = await popover.onWillDismiss();
            if (result.role === "ok") {
                this.value = result.data;
            }

            this.overlayVisible = false;
            this.setFocus({preventScroll: true});
        }
    }

    itemClickUnlisten: EventUnlisten;

    connectedCallback() {

        this.valueChanged(this.value, undefined, false);

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
            this.itemClickUnlisten = addEventListener(item, "click", ev => this.focused && ev.target === item && (this.open({target: this.element}) || true));
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
