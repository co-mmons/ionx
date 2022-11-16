import {Component, h, Host} from "@stencil/core";
import {FormController, required} from "ionx/forms";
import {DefaultLinkScheme} from "../DefaultLinkScheme";
import {showLinkEditor} from "../showLinkEditor";
import {TestScheme} from "./TestScheme";

@Component({
    tag: "ionx-link-editor-test"
})
export class LinkEditorTest {

    data = new FormController({
        test: {value: undefined, validators: [required]}
    }).bindRenderer(this)

    render() {
        return <Host>

            <ionx-form-field label="Inline editor" error={this.data.controls.test.error}>
                <ionx-link-editor
                    style={{margin: "16px"}}
                    empty={true}
                    placeholder="No link"
                    schemes={[DefaultLinkScheme.www, new TestScheme()]}
                    ref={this.data.controls.test.attach()}/>
            </ionx-form-field>

            <ion-button onClick={() => this.data.validate()}>validate</ion-button>

            <ionx-form-field label="Dialog editor">
                <ion-button onClick={() => showLinkEditor({value: undefined})}>open dialog</ion-button>
            </ionx-form-field>

        </Host>
    }
}
