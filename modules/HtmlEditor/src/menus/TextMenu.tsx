import {intl, translate} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core";
import {Component, Fragment, h, Listen, Prop, State} from "@stencil/core";
import {toggleMark} from "prosemirror-commands";
import {isMarkActive} from "../prosemirror/active";
import {toggleInlineMark} from "../prosemirror/commands/toogleInlineMark";
import {findMarksInSelection} from "../prosemirror/utils/findMarksInSelection";
import {isMarkFromGroup} from "../prosemirror/utils/isMarkFromGroup";
import {FontSize} from "./FontSize";

@Component({
    tag: "ionx-html-editor-text-menu",
    styleUrl: "TextMenu.scss",
    shadow: true
})
export class TextMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    boldActivated: boolean;

    emphasisActivated: boolean;

    underlineActivated: boolean;

    activeFontSize: FontSize;

    marks: string[];

    @State()
    activeColor: string;

    async toggle(markName: string) {

        const view = await this.editor.getView();
        const {state} = view;
        const {marks} = state.schema;

        const command = toggleMark(marks[markName]);

        if (command(view.state)) {
            command(view.state, t => view.dispatch(t));
        }

        popoverController.dismiss();
    }

    async toggleFontSize(size?: FontSize) {

        this.activeFontSize = size;

        const view = await this.editor.getView();
        const {state} = view;

        if (size) {
            toggleInlineMark(state.schema.marks.fontSize, {fontSize: size.css})(state, view.dispatch);
        } else {
            toggleMark(state.schema.marks.fontSize)(state, view.dispatch);
        }

        popoverController.dismiss();
    }

    async toggleColor(color?: string) {

        this.activeColor = color;

        const view = await this.editor.getView();
        const {state} = view;

        if (color) {
            toggleInlineMark(state.schema.marks.TextColorMark, {color})(state, view.dispatch);
        } else {
            toggleMark(state.schema.marks.TextColorMark)(state, view.dispatch);
            popoverController.dismiss();
        }
    }

    @Listen("ionViewDidLeave")
    didDismiss() {
        this.editor.setFocus();
    }

    connectedCallback() {

        this.editor.getView().then(view => {

            const {state} = view;
            const {marks} = state.schema;

            this.marks = Object.entries(marks).filter(([_markName, mark]) => isMarkFromGroup(mark, "textFormat"))
                .map(([markName]) => markName);

            this.boldActivated = marks.strong && isMarkActive(state, marks.strong);
            this.emphasisActivated = marks.emphasis && isMarkActive(state, marks.emphasis);
            this.underlineActivated = marks.underline && isMarkActive(state, marks.underline);

            this.activeColor = marks.textColor && findMarksInSelection(state, marks.textColor).map(mark => mark.attrs.color)
                .find(color => !!color);

            this.activeFontSize = undefined;
            if (marks.fontSize) {
                MARKS: for (const mark of findMarksInSelection(state, marks.fontSize)) {

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
            }
        })
    }

    render() {

        if (!this.marks) {
            return;
        }

        return <ion-list lines="full">

            {this.marks.includes("strong") && <ion-item button detail={false} onClick={() => this.toggle("strong")}>
                <ion-label style={{fontWeight: "bold"}}>{translate(intl, "ionx/HtmlEditor#Bold|text")}</ion-label>
                {this.boldActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>}

            {this.marks.includes("emphasis") && <ion-item button detail={false} onClick={() => this.toggle("emphasis")}>
                <ion-label style={{fontStyle: "italic"}}>{translate(intl, "ionx/HtmlEditor#Italic|text")}</ion-label>
                {this.emphasisActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>}

            {this.marks.includes("underline") && <ion-item button detail={false} onClick={() => this.toggle("underline")}>
                <ion-label style={{textDecoration: "underline"}}>{intl.message`ionx/HtmlEditor#Underline|text`}</ion-label>
                {this.underlineActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>}

            {this.marks.includes("textColor") && <ion-item detail={false}>
                <ion-label>{intl.message`ionx/HtmlEditor#Text color`}</ion-label>
                <input slot="end" type="color" value={this.activeColor || "#000000"} onInput={ev => this.toggleColor((ev.target as HTMLInputElement).value)}/>
                {this.activeColor && <ion-button slot="end" fill="clear" size="small" onClick={() => this.toggleColor()}>
                    <ion-icon name="close" slot="icon-only"/>
                </ion-button>}
            </ion-item>}

            {this.marks.includes("fontSize") && <Fragment>
                <ion-item-divider>
                    <ion-label>{intl.message`ionx/HtmlEditor#Text size`}</ion-label>
                </ion-item-divider>

                {<ion-item button={true} detail={false} onClick={() => this.toggleFontSize()}>
                    <ion-label>{intl.message`ionx/HtmlEditor#Default|text size`}</ion-label>
                </ion-item>}

                {FontSize.values().map(size => <ion-item button detail={false} onClick={() => this.toggleFontSize(size)}>
                    <ion-label style={{fontSize: size.css}}>{intl.message(size.label)}</ion-label>
                    {this.activeFontSize === size && <ion-icon name="checkmark" slot="end"/>}
                </ion-item>)}
            </Fragment>}

        </ion-list>
    }
}
