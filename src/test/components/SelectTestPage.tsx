import {Component, h, Host} from "@stencil/core";
import {SelectOption} from "../../components/Select/SelectOption";

@Component({
    tag: "ionx-test-select"
})
export class SelectTestPage {

    options: SelectOption[];

    connectedCallback() {
        this.options = [];
        for (let i = 0; i < 500; i++) {
            this.options.push({value: i, label: `option ${i}`});
        }
    }

    render() {

        return <Host>
            <ion-content>
                <ion-grid>

                    <ion-row>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">not orderable, not empty, modal, multiple, with value</ion-label>
                                <ionx-select placeholder="Olalalala" orderable={false} overlay="modal" empty={false} multiple={true} options={this.options} value={[344]}/>
                            </ionx-form-item>
                        </ion-col>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">orderable, modal, empty, multiple</ion-label>
                                <ionx-select placeholder="Olalalala" orderable={true} overlay="modal" multiple={true} options={this.options}/>
                            </ionx-form-item>
                        </ion-col>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">orderable, modal, not empty, multiple</ion-label>
                                <ionx-select placeholder="Olalalala" orderable={true} readonly={false} overlay="modal" multiple={true} options={this.options} value={[341, 342]}/>
                            </ionx-form-item>
                        </ion-col>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">popover, single value</ion-label>
                                <ionx-select placeholder="Olalalala" overlay="popover" options={this.options.slice(0, 50)} value={45}/>
                            </ionx-form-item>
                        </ion-col>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">popover, multiple value</ion-label>
                                <ionx-select placeholder="Olalalala" overlay="popover" multiple={true} options={this.options.slice(0, 50)} value={45}/>
                            </ionx-form-item>
                        </ion-col>

                        <ion-col size-xs={12} size-md={6}>
                            <ionx-form-item fill="solid">
                                <ion-label position="stacked">long text</ion-label>
                                <ionx-select placeholder="Olalalala" overlay="modal" multiple={true} options={[{value: "lorem ipsum lorem ipsum volem molem kolem ipsum"}]}/>
                            </ionx-form-item>
                        </ion-col>

                    </ion-row>

                </ion-grid>
            </ion-content>
        </Host>
    }
}
