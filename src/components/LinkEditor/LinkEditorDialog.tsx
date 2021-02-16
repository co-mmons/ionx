import {intl} from "@co.mmons/js-intl";
import {Component, Element, h, Prop} from "@stencil/core";
import {LinkEditorProps} from "./LinkEditorProps";

@Component({
    tag: "ionx-link-editor-dialog",
    scoped: true
})
export class LinkEditorDialog {

    @Element()
    element: HTMLElement;

    @Prop()
    editorProps: LinkEditorProps;

    async ok() {

        const editor = this.element.querySelector<HTMLIonxLinkEditorElement>("ionx-link-editor");
        const link = await editor.buildLink();
        if (link) {
            return link;
        } else {
            throw new Error();
        }
    }

    render() {
        return <ionx-dialog-content>

            <ionx-link-editor {...this.editorProps} slot="message"/>

            <ionx-dialog-buttons
                slot="footer"
                buttons={[
                    {label: intl.message`@co.mmons/js-intl#Cancel`, role: "cancel"},
                    {label: intl.message`@co.mmons/js-intl#Ok`, role: "ok", valueHandler: this.ok.bind(this)}
                ]}/>

        </ionx-dialog-content>
    }
}
