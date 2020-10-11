import {intl} from "@co.mmons/js-intl";
import {Component, Host, h, Prop} from "@stencil/core";

const weekdayNarrowFormat: Intl.DateTimeFormatOptions = {
    weekday: "short"
};

// @ts-ignore
const monthYearFormat: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric"
};

const monthFormat: Intl.DateTimeFormatOptions = {
    month: "long"
};

@Component({
    tag: "ionx-date-time-overlay",
    styleUrl: "DateTimeOverlay.scss"
})
export class DateTimeOverlay {

    @Prop()
    overlayTitle: string;

    @Prop()
    timeZoneDisabled: boolean;

    dateView: "days" | "months" | "years" = "days";

    dateValues: {id: number, label: string | number, sublabel?: string, checked?: boolean, hidden?: boolean}[];

    dateViewValue: Date;

    value: Date;

    generate() {

        this.dateValues = [];

        let tmpDate = new Date(this.dateViewValue);

        if (this.dateView == "days") {

            for (let d = 1; d <= 33; d++) {
                tmpDate.setUTCDate(d);
                tmpDate.setUTCHours(0, 0, 0, 0);
                this.dateValues.push({
                    id: d,
                    label: d,
                    sublabel: intl.dateFormat(tmpDate, weekdayNarrowFormat),
                    checked: (this.value.getUTCFullYear() === tmpDate.getUTCFullYear() && this.value.getUTCMonth() === tmpDate.getUTCMonth() && this.value.getUTCDate() === d),
                    hidden: tmpDate.getUTCMonth() != this.dateViewValue.getUTCMonth()
                });
            }

        } else if (this.dateView === "months") {

            let tmpDate = new Date(Date.UTC(1999, this.dateViewValue.getUTCMonth()));

            for (let m = 0; m < 12; m++) {
                tmpDate.setUTCMonth(m);

                this.dateValues.push({
                    id: m,
                    label: intl.dateFormat(tmpDate, monthFormat),
                    checked: this.value.getUTCFullYear() === this.dateViewValue.getUTCFullYear() && this.value.getUTCMonth() === m
                });
            }

        } else if (this.dateView === "years") {

            let tmpDate = new Date(this.dateViewValue);

            let yearHundred = Math.floor(tmpDate.getUTCFullYear() / 100) * 100;
            let yearTens = tmpDate.getUTCFullYear() - yearHundred;

            let yearStart = 0;
            if (yearTens >= 80) {
                yearStart = 80;
            } else if (yearTens >= 60) {
                yearStart = 60;
            } else if (yearTens >= 40) {
                yearStart = 40;
            } else if (yearTens >= 20) {
                yearStart = 20;
            }

            tmpDate.setUTCFullYear(yearHundred + yearStart - 1);

            for (let y = 0; y < 20; y++) {
                tmpDate.setUTCFullYear(tmpDate.getUTCFullYear() + 1);

                this.dateValues.push({
                    id: tmpDate.getUTCFullYear(),
                    label: tmpDate.getUTCFullYear(),
                    checked: this.value.getUTCFullYear() == tmpDate.getUTCFullYear()
                });
            }
        }

    }

    render() {
        return <Host>
            <ion-header>
                <ion-toolbar>
                    <ion-title>{this.overlayTitle}</ion-title>
                </ion-toolbar>
            </ion-header>
        </Host>
    }
}
