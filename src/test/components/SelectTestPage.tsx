import {Component, h, Host} from "@stencil/core";
import {SelectOption} from "../../components/Select/SelectOption";

@Component({
    tag: "ionx-test-select"
})
export class SelectTestPage {

    options: SelectOption[];

    connectedCallback() {
        this.options = [];
        for (let i = 0; i < 1000; i++) {
            this.options.push({value: i, label: `option ${i}`});
        }
    }

    render() {

        return <Host>
            <ion-content>
                <ion-grid>

                    <ion-row>

                        <ion-col size-xs={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">sdsdsd</ion-label>
                                <ionx-select placeholder="Olalalala" orderable={false} overlay="modal" multiple={true} options={this.options} value={[1, 2]}>

                                </ionx-select>
                            </ionx-form-item>
                        </ion-col>

                    </ion-row>

                </ion-grid>
            </ion-content>
        </Host>
    }
}
