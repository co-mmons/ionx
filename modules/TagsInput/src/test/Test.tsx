import {Component, h, Host} from "@stencil/core";
import {defineIonxForms} from "ionx/forms";

defineIonxForms()

@Component({
    tag: "ionx-test"
})
export class Test {

    render() {
        return <Host>

            <ionx-form-field label="No value">
                <ionx-tags-input/>
            </ionx-form-field>

            <ionx-form-field label="Has value">
                <ionx-tags-input value={["alala", "bebebe"]} readonly={true}/>
            </ionx-form-field>

        </Host>
    }
}
