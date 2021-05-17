import {Component, h, Host, State} from "@stencil/core";
import {FormController} from "../FormController";

@Component({
    tag: "ionx-test"
})
export class Test {

    data = new FormController({
        test: {value: null as string},
        otherValue: {value: null as string}
    }).bindRenderer(this);

    @State()
    readonly = true;

    render() {
        return <Host>
            <ion-button onClick={() => this.readonly = !this.readonly}>toggle readonly</ion-button>
            <ion-input ref={this.data.controls.otherValue.attach()}/>
            {!this.readonly && <ionx-form-field label="Test">
                <ion-input ref={this.data.controls.test.attach()}/>
            </ionx-form-field>}
        </Host>
    }
}
