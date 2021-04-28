import {Component, h, Host} from "@stencil/core";
import {showLinkEditor} from "../showLinkEditor";

@Component({
    tag: "ionx-link-editor-test"
})
export class LinkEditorTest {

    render() {
        return <Host>

            <ionx-form-field label="Inline editor">
                <ionx-link-editor style={{margin: "16px"}}/>
            </ionx-form-field>

            <ionx-form-field label="Dialog editor">
                <ion-button onClick={() => showLinkEditor({link: undefined})}>open dialog</ion-button>
            </ionx-form-field>

        </Host>
    }
}
