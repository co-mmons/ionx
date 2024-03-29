import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core/components";
import {Component, h, Prop} from "@stencil/core";
import {setBlockType} from "prosemirror-commands";
import {findParentNodeOfType} from "prosemirror-utils";

@Component({
    tag: "ionx-html-editor-paragraph-menu",
    styleUrl: "ParagraphMenu.scss",
    shadow: true
})
export class ParagraphMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    activeHeading: number;

    async indentLevel(move: 1 | -1) {
        const view = await this.editor.getView();
        const {selection, schema} = view.state;

        const node = findParentNodeOfType(schema.nodes.heading)(selection) ?? findParentNodeOfType(schema.nodes.paragraph)(selection);
        if (node) {
            const currentLevel = parseInt((node.node.attrs["indent"] || "0").replace("px", ""), 10) / 32;
            const newLevel = currentLevel === 1 && move === -1 ? 0 : currentLevel + move;
            view.dispatch(view.state.tr.setNodeMarkup(node.pos, null, {indent: newLevel > 0 ? `${newLevel * 32}px` : null}));
        }

        await popoverController.dismiss();
        view.focus();
    }

    async toggleHeading(heading: number) {

        const view = await this.editor.getView();
        const {state} = view;
        const {nodes} = state.schema;

        if (heading > 0 && this.activeHeading !== heading) {

            const command = setBlockType(nodes.heading, {level: heading});
            if (command(state)) {
                command(state, t => view.dispatch(t));
            }

        } else {
            setBlockType(nodes.paragraph)(state, t => view.dispatch(t));
        }

        await popoverController.dismiss();
        view.focus();
    }

    connectedCallback() {

        this.editor.getView().then(view => {

            const {schema, selection} = view.state;

            const activeHeading = findParentNodeOfType(schema.nodes.heading)(selection);
            if (activeHeading) {
                this.activeHeading = activeHeading.node.attrs.level;
            }
        });
    }

    render() {
        return <ion-list lines="full">

            <ion-item button={true} detail={false} onClick={() => this.indentLevel(1)}>
                <ion-label>{intl.message`ionx/HtmlEditor#listMenu/Increase indent`}</ion-label>
                <ion-icon src="/assets/ionx.HtmlEditor/icons/indent-increase.svg" slot="start"/>
            </ion-item>

            <ion-item button={true} detail={false} onClick={() => this.indentLevel(-1)}>
                <ion-label>{intl.message`ionx/HtmlEditor#listMenu/Decrease indent`}</ion-label>
                <ion-icon src="/assets/ionx.HtmlEditor/icons/indent-decrease.svg" slot="start"/>
            </ion-item>

            <ion-item-divider>
                <ion-label>{intl.message`ionx/HtmlEditor#Heading`}</ion-label>
            </ion-item-divider>

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
