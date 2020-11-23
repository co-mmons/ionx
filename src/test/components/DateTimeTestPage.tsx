import {intl, pushMessages} from "@co.mmons/js-intl";
import {TimeZoneDate} from "@co.mmons/js-utils/core";
import {Component, Host, h, Element} from "@stencil/core";

@Component({
    tag: "ionx-test-date-time"
})
export class DateTimeTestPage {

    @Element()
    element: HTMLElement;

    date = new TimeZoneDate(new Date());

    componentDidLoad() {

        import(`../../components/DateTime/intl/pl.json`).then(messages => pushMessages(intl.locale, "ionx/DateTime", messages.default));

        const dt = this.element.querySelector<HTMLIonxDateTimeElement>("ionx-date-time");
        dt.open();
        // dt.ope
    }

    render() {

        return <Host>
            <ion-content>
                <ion-grid>

                    <ion-row>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">date only</ion-label>
                                <ionx-date-time placeholder="Wybierz datę..." clearButtonVisible={true} value={this.date}/>
                            </ionx-form-item>
                        </ion-col>

                    </ion-row>

                    <ion-row>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">date only</ion-label>
                                <ion-input type="date" placeholder="Wybierz datę..."/>
                            </ionx-form-item>
                        </ion-col>

                    </ion-row>

                </ion-grid>
            </ion-content>
        </Host>
    }
}
