import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-test-date-time"
})
export class DateTimeTestPage {

    render() {

        return <Host>
            <ion-content>
                <ionx-date-time/>
            </ion-content>
        </Host>
    }
}
