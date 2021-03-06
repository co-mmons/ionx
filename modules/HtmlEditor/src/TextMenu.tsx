import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core";
import {Component, h, Listen, Prop} from "@stencil/core";
import {toggleMark} from "prosemirror-commands";
import {FontSize} from "./FontSize";
import {isMarkActive} from "./prosemirror/active";
import {Command} from "./prosemirror/command";
import {toggleInlineMark} from "./prosemirror/commands/toogleInlineMark";
import {schema} from "./prosemirror/schema";
import {findMarksInSelection} from "./prosemirror/utils/findMarksInSelection";

@Component({
    tag: "ionx-html-editor-text-menu",
    styleUrl: "TextMenu.scss",
    shadow: true
})
export class TextMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    boldActivated: boolean;

    italicActivated: boolean;

    underlineActivated: boolean;

    activeFontSize: FontSize;

    async toggle(name: string) {

        let command: Command;

        if (name === "bold") {
            command = toggleMark(schema.marks.strong);
        } else if (name === "italic") {
            command = toggleMark(schema.marks.em);
        } else if (name === "underline") {
            command = toggleMark(schema.marks.underline);
        }

        const view = await this.editor.getView();

        if (command(view.state)) {
            command(view.state, t => view.dispatch(t));
        }

        popoverController.dismiss();
    }

    async resetFontSize() {

        const view = await this.editor.getView();

        toggleMark(schema.marks.fontSize)(view.state, t => view.dispatch(t));

        popoverController.dismiss();
    }

    async toggleFontSize(size: FontSize) {

        const view = await this.editor.getView();

        const command = toggleInlineMark(schema.marks.fontSize, {fontSize: size.css});
        if (command(view.state)) {
            command(view.state, t => view.dispatch(t));
        }

        popoverController.dismiss();
    }

    @Listen("ionViewDidLeave")
    didDismiss() {
        this.editor.setFocus();
    }

    connectedCallback() {

        this.editor.getView().then(view => {
            this.boldActivated = isMarkActive(view.state, schema.marks.strong);
            this.italicActivated = isMarkActive(view.state, schema.marks.em);
            this.underlineActivated = isMarkActive(view.state, schema.marks.underline);

            this.activeFontSize = undefined;
            MARKS: for (const mark of findMarksInSelection(view.state, schema.marks.fontSize)) {

                for (const size of FontSize.values()) {
                    if (size.css === mark.attrs.fontSize) {

                        // ups, mamy różne rozmiary w zaznaczeniu
                        if (this.activeFontSize && size !== this.activeFontSize) {
                            this.activeFontSize = undefined;
                            break MARKS;
                        }

                        this.activeFontSize = size;
                    }
                }
            }
        });
    }

    render() {
        return <ion-list lines="full">

            <ion-item button detail={false} onClick={() => this.toggle("bold")}>
                <ion-label style={{fontWeight: "bold"}}>{intl.message`ionx/HtmlEditor#Bold|text`}</ion-label>
                {this.boldActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>

            <ion-item button detail={false} onClick={() => this.toggle("italic")}>
                <ion-label style={{fontStyle: "italic"}}>{intl.message`ionx/HtmlEditor#Italic|text`}</ion-label>
                {this.italicActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>

            <ion-item button detail={false} onClick={() => this.toggle("underline")}>
                <ion-label style={{textDecoration: "underline"}}>{intl.message`ionx/HtmlEditor#Underline|text`}</ion-label>
                {this.underlineActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>

            <ion-item-divider>
                <ion-label>{intl.message`ionx/HtmlEditor#Text size`}</ion-label>
            </ion-item-divider>

            {<ion-item button={true} detail={false} onClick={() => this.resetFontSize()}>
                <ion-label>{intl.message`ionx/HtmlEditor#Default|text size`}</ion-label>
            </ion-item>}

            {FontSize.values().map(size => <ion-item button detail={false} onClick={() => this.toggleFontSize(size)}>
                <ion-label style={{fontSize: size.css}}>{intl.message(size.label)}</ion-label>
                {this.activeFontSize === size && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>)}

        </ion-list>
    }
}
