import {Component, h, Host} from "@stencil/core";
import {defineIonxForms} from "ionx/forms";

defineIonxForms();

@Component({
    tag: "ionx-toggle-labels-test"
})
export class Test {

    render() {
        return <Host>

            <ionx-form-field label="Default toggle">

                <ionx-toggle-labels on="yes" off="no" defaultToggle={true} value={true}/>

            </ionx-form-field>

            <ionx-form-field label="User defined toggle">

                <ionx-toggle-labels on="yes" off="no" value={true}>
                    <ion-toggle/>
                </ionx-toggle-labels>

            </ionx-form-field>

        </Host>
    }
}
