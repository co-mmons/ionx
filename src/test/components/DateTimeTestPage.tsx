import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-test-date-time"
})
export class DateTimeTestPage {

    date = new Date()

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
