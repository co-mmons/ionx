import {intl} from "@co.mmons/js-intl";
import {TimeZoneDate} from "@co.mmons/js-utils/core";
import {Component, Element, h, Host, Listen, Prop, State} from "@stencil/core";

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

    @State()
    date: Date;

    @Prop()
    timeZoneDisabled: boolean;

    @Prop()
    value: TimeZoneDate;

    values: {[key: string]: string | number} = {};

    ranges() {

        const ranges = {
            "Year": [1900, new Date().getUTCFullYear() + 2],
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

    ok() {
        const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
        popover.dismiss(new TimeZoneDate(this.date), "ok");
    }

    cancel() {
        const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
        popover.dismiss(undefined, "cancel");
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
                input.value = this.values[input.name];
                return;
            }

            this.values[input.name] = input.value;

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
        }

    }

    connectedCallback() {
        this.date = new Date(this.value);

        if (this.dateOnly) {
            this.date.setUTCHours(0);
            this.date.setUTCMinutes(0, 0, 0);
        }
    }

    renderPart(part: "Hour" | "Minute" | "Year" | "Month" | "Day" | "Time zone", range?: number[]) {

        if (part !== "Time zone") {

            let def: number;
            let val: number | string;

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

            if (part in this.values && this.values[part] === "") {
                val = "";
            }

            return <ion-item>
                <ion-label>{intl.message(`ionx/DateTime#${part}`)}</ion-label>
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
                <ionx-select options={[{value: "", label: intl.message`No time zone`}]} value={""}/>
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
