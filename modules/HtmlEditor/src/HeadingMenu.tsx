import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core";
import {Component, h, Listen, Prop} from "@stencil/core";
import {setBlockType} from "prosemirror-commands";
import {findParentNodeOfType} from "prosemirror-utils";
import {schema} from "./prosemirror/schema";

@Component({
    tag: "ionx-html-editor-heading-menu",
    styleUrl: "HeadingMenu.scss",
    shadow: true
})
export class HeadingMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    activeHeading: number;

    async toggleHeading(heading: number) {

        const view = await this.editor.getView();

        if (heading > 0 && this.activeHeading !== heading) {

            const command = setBlockType(schema.nodes.heading, {level: heading});
            if (command(view.state)) {
                command(view.state, t => view.dispatch(t));
            }

        } else {
            setBlockType(schema.nodes.paragraph)(view.state, t => view.dispatch(t));
        }

        popoverController.dismiss();
    }

    @Listen("ionViewDidLeave")
    didDismiss() {
        this.editor.setFocus();
    }

    connectedCallback() {

        this.editor.getView().then(view => {

            const activeHeading = findParentNodeOfType(schema.nodes.heading)(view.state.selection);
            if (activeHeading) {
                this.activeHeading = activeHeading.node.attrs.level;
            }
        });
    }

    render() {
        return <ion-list lines="full">

            {this.activeHeading > 0 && <ion-item button detail={false} onClick={() => this.toggleHeading(0)}>
                <ion-label>{intl.message`ionx/HtmlEditor#Plain text`}</ion-label>
            </ion-item>}

            {[1, 2, 3, 4, 5, 6].map(size => <ion-item button detail={false} onClick={() => this.toggleHeading(size)}>
                <ion-label style={{fontWeight: "500", fontSize: `${130 - ((size - 1) * 5)}%`}}>{intl.message`ionx/HtmlEditor#Heading`} {size}</ion-label>
                {this.activeHeading === size && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>)}

        </ion-list>
    }
}
