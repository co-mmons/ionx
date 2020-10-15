import {Component, Host, h, Element} from "@stencil/core";

@Component({
    tag: "ionx-test-date-time"
})
export class DateTimeTestPage {

    @Element()
    element: HTMLElement;

    date = new Date()

    componentDidLoad() {
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

                </ion-grid>
            </ion-content>
        </Host>
    }
}
