import {intl, setMessages} from "@co.mmons/js-intl";
import {Component, h, Host} from "@stencil/core";
import {showLinkEditor} from "../../components/LinkEditor";

@Component({
    tag: "ionx-test-link-editor"
})
export class LinkEditorTestPage {

    async showEditor() {
        const link = await showLinkEditor({link: {href: "https://mice.software"}});
        console.log(link);
    }

    connectedCallback() {

        import(`../../components/forms/intl/pl.json`).then(messages => setMessages("ionx/forms", intl.locale, messages.default));
        import(`../../components/LinkEditor/intl/pl.json`).then(messages => setMessages("ionx/LinkEditor", intl.locale, messages.default));

        this.showEditor();
    }

    render() {

        return <Host>
            <ion-content>
                <ion-grid>

                    <ion-row>

                        <ion-col size-xs={12} size-md={6}>
                            <ion-button onClick={() => this.showEditor()}>open</ion-button>
                        </ion-col>

                    </ion-row>

                </ion-grid>
            </ion-content>
        </Host>
    }
}
