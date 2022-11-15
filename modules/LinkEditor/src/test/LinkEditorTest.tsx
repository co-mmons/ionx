import {Component, h, Host} from "@stencil/core";
import {DefaultLinkScheme} from "../DefaultLinkScheme";
import {showLinkEditor} from "../showLinkEditor";
import {TestScheme} from "./TestScheme";

@Component({
    tag: "ionx-link-editor-test"
})
export class LinkEditorTest {

    render() {
        return <Host>

            <ionx-form-field label="Inline editor">
                <ionx-link-editor
                    style={{margin: "16px"}}
                    empty={true}
                    placeholder="No link"
                    schemes={[DefaultLinkScheme.www, new TestScheme()]}
                    value={{href: "ola:test"}}
                    onIonChange={ev => console.log(ev.detail.value)}/>
            </ionx-form-field>

            <ionx-form-field label="Dialog editor">
                <ion-button onClick={() => showLinkEditor({value: undefined})}>open dialog</ion-button>
            </ionx-form-field>

        </Host>
    }
}
