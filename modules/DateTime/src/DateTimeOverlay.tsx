import {intl} from "@co.mmons/js-intl";
import {TimeZoneDate, timeZoneOffset} from "@co.mmons/js-utils/core";
import {Component, Element, h, Host, Listen, Prop, State} from "@stencil/core";
import {defineIonxSelect} from "ionx/Select";
import {loadIntlMessages} from "./intl/loadIntlMessages";
import {noTimeZoneSelectValue} from "./noTimeZoneSelectValue";
import {timeZoneSelectItemsLoader} from "./timeZoneSelectItemsLoader";

type NumericDateTimePart = "Hour" | "Minute" | "Year" | "Month" | "Day";

defineIonxSelect();

@Component({
    tag: "ionx-date-time-overlay",
    styleUrl: "DateTimeOverlay.scss",
    shadow: true
})
export class DateTimeOverlay {

    @Element()
    element: HTMLElement;

    @Prop()
    dateOnly: boolean;

    @Prop()
    timeZoneDisabled: boolean;

    @Prop()
    timeZoneRequired: boolean;

    @Prop()
    value: TimeZoneDate;

    @State()
    date: Date;

    numericValues: {[key: string]: number} = {};

    timeZoneValue: string;

    ranges() {

        const ranges = {
            "Year": [1900, new Date().getUTCFullYear() + 50],
            "Month": [1, 12],
            "Day": [1, 31],
            "Hour": [0, 23],
            "Minute": [0, 59]
        };

        let tmp: Date;

        // generate possible days
        for (let d = 1; d <= 31; d++) {

            if (d === 1) {
                tmp = new Date(this.date);
                ranges["Day"] = [1, 1];
            }

            tmp.setUTCDate(d);
            tmp.setUTCHours(0, 0, 0, 0);

            if (tmp.getUTCMonth() === this.date.getUTCMonth()) {
                ranges["Day"][1] = d;
            }
        }

        return ranges;
    }

    move(part: NumericDateTimePart, step: -1 | 1) {

        const date = new Date(this.date);

        if (part === "Year") {
            date.setUTCFullYear(date.getUTCFullYear() + step);
        } else if  (part === "Month") {
            date.setUTCMonth(date.getUTCMonth() + step);
        } else if  (part === "Day") {
            date.setUTCDate(date.getUTCDate() + step);
        } else if  (part === "Hour") {
            date.setUTCHours(date.getUTCHours() + step);
        } else if  (part === "Minute") {
            date.setUTCMinutes(date.getUTCMinutes() + step);
        }

        this.date = date;
    }

    now() {
        const now = new Date();
        this.date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0));
    }

    ok() {

        let value = new TimeZoneDate(this.date, this.timeZoneValue);

        if (!this.dateOnly && this.timeZoneValue && this.timeZoneValue !== "UTC") {
            value = new TimeZoneDate(value.getTime() - (timeZoneOffset(this.timeZoneValue, this.value) * -1), this.timeZoneValue);
        }

        const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
        popover.dismiss(value, "ok");
    }

    cancel() {
        const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
        popover.dismiss(undefined, "cancel");
    }

    @Listen("ionFocus")
    async onFocus(event: CustomEvent) {

        const input = event.composedPath().find(t => (t as HTMLElement).tagName === "ION-INPUT") as HTMLIonInputElement;

        if (input) {
            (await input.getInputElement()).select();
        }

    }

    @Listen("keydown")
    async onKeyDown(event: KeyboardEvent) {

        const input = event.composedPath().find(t => (t as HTMLElement).tagName === "ION-INPUT") as HTMLIonInputElement;

        if (input && (event.key === "e" || event.key === "E" || event.key === "-" || event.key === "." || event.key === ",")) {
            event.preventDefault();

        } else if (input && event.key === "Enter") {
            const next = input.closest("ion-item").nextElementSibling?.querySelector<HTMLIonInputElement>("ion-input");
            if (next) {
                event.preventDefault();
                next.setFocus();
                (await next.getInputElement()).select();
            } else {
                this.ok();
            }
        }
    }

    @Listen("ionChange")
    onChange(event: CustomEvent) {

        const input = event.composedPath().find(t => (t as HTMLElement).tagName === "ION-INPUT") as HTMLIonInputElement;

        if (input) {

            const stringed = `${input.value}`;

            if (stringed.length < input.min.length) {
                return;
            }

            if (stringed.length > input.max.length || input.value > parseInt(input.max, 10)) {
                input.value = this.numericValues[input.name];
                return;
            }

            this.numericValues[input.name] = input.value as number;

            const date = new Date(this.date);

            if (input.name === "Year") {
                date.setUTCFullYear(input.value as number);
            } else if (input.name === "Month") {
                date.setUTCMonth(input.value as number - 1);
            } else if (input.name === "Day") {
                date.setUTCDate(input.value as number);
            } else if (input.name === "Minute") {
                date.setUTCMinutes(input.value as number, 0, 0);
            } else if (input.name === "Hour") {
                date.setUTCHours(input.value as number);
            }

            this.date = date;

        } else {
            this.timeZoneValue = event.detail.value;
        }

    }

    async componentWillLoad() {
        await loadIntlMessages();
    }

    connectedCallback() {
        this.date = new Date(this.value);
        this.timeZoneValue = this.value.timeZone || undefined;

        if (this.dateOnly) {
            this.date.setUTCHours(0, 0, 0, 0);
        } else {
            this.date.setUTCSeconds(0, 0);
        }
    }

    renderPart(part: NumericDateTimePart | "Time zone", range?: number[]) {

        if (part !== "Time zone") {

            let def: number;
            let val: number;

            if (part === "Hour") {
                def = val = this.date.getUTCHours();
            } else if (part === "Minute") {
                def = val = this.date.getUTCMinutes();
            } else if (part === "Year") {
                def = val = this.date.getUTCFullYear(), length = 4;
            } else if (part === "Month") {
                def = val = this.date.getUTCMonth() + 1;
            } else if (part === "Day") {
                def = val = this.date.getUTCDate();
            }

            if (part in this.numericValues && typeof this.numericValues[part] !== "number") {
                val = undefined;
            }

            return <ion-item>

                <ion-label class="numeric-label">{intl.message(`ionx/DateTime#${part}`)}</ion-label>

                <div class="numeric-buttons" slot="end">
                    <ion-button fill="clear" size="small" tabindex={-1} onClick={() => this.move(part, -1)}>
                        <ion-icon slot="icon-only" name="remove-circle-outline"/>
                    </ion-button>
                    <ion-button fill="clear" size="small" tabindex={-1} onClick={() => this.move(part, 1)}>
                        <ion-icon slot="icon-only" name="add-circle"/>
                    </ion-button>
                </div>

                <ion-input
                    type="number"
                    name={part}
                    placeholder={`${def}`}
                    value={val}
                    min={`${range[0]}`}
                    max={`${range[1]}`}/>

            </ion-item>

        } else {

            return <ion-item>
                <ion-label position="stacked">{intl.message(`ionx/DateTime#${part}`)}</ion-label>
                <ionx-select
                    overlay="modal"
                    placeholder={this.timeZoneRequired ? "Choose..." : intl.message(noTimeZoneSelectValue.label)}
                    value={this.timeZoneValue}
                    lazyItems={timeZoneSelectItemsLoader(this.timeZoneRequired, this.date)}/>
            </ion-item>
        }
    }

    render() {

        const ranges = this.ranges();

        return <Host>

            <div>

                {this.renderPart("Year", ranges["Year"])}
                {this.renderPart("Month", ranges["Month"])}
                {this.renderPart("Day", ranges["Day"])}
                {!this.dateOnly && this.renderPart("Hour", ranges["Hour"])}
                {!this.dateOnly && this.renderPart("Minute", ranges["Minute"])}

                <ion-item>
                    <ion-button size="small" slot="end" onClick={() => this.now()}>{this.dateOnly ? intl.message`ionx/DateTime#Today` : intl.message`ionx/DateTime#Now`}</ion-button>
                </ion-item>

                {!this.timeZoneDisabled && this.renderPart("Time zone")}

            </div>

            <ion-footer>
                <ion-toolbar>

                    <div>

                        <ion-button fill="clear" onClick={() => this.cancel()}>{intl.message`@co.mmons/js-intl#Cancel`}</ion-button>

                        <ion-button fill="clear" onClick={() => this.ok()}>{intl.message`@co.mmons/js-intl#Ok`}</ion-button>

                    </div>

                </ion-toolbar>
            </ion-footer>

        </Host>
    }
}
