import {Component, h, Host} from "@stencil/core";
import {defineIonxForms} from "ionx/forms";

defineIonxForms()

@Component({
    tag: "ionx-test",
    styleUrl: "../unification.scss"
})
export class Test {

    render() {
        return <Host>
            <ion-toggle mode="ios"/>
            <ion-toggle mode="md"/>

            <ionx-form-field label="ios">
                <ion-toggle mode="ios"/>
            </ionx-form-field>

            <ionx-form-field label="md">
                <ion-toggle mode="md"/>
            </ionx-form-field>
        </Host>
    }
}
