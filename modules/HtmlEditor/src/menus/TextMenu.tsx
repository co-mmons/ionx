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

    strongActivated: boolean;

    emphasisActivated: boolean;

    underlineActivated: boolean;

    activeFontSize: FontSize;

    marks: string[];

    @State()
    activeForegroundColor: string;

    @State()
    activeBackgroundColor: string;

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

    async toggleColor(mark: "textForegroundColor" | "textBackgroundColor", color?: string) {

        if (mark === "textForegroundColor") {
            this.activeForegroundColor = color;
        } else {
            this.activeBackgroundColor = color;
        }

        const view = await this.editor.getView();
        const {state} = view;
        const {marks} = state.schema;

        if (color) {
            toggleInlineMark(marks[mark], {color})(state, view.dispatch);
        } else {
            toggleMark(marks[mark])(state, view.dispatch);
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

            this.strongActivated = marks.strong && isMarkActive(state, marks.strong);
            this.emphasisActivated = marks.emphasis && isMarkActive(state, marks.emphasis);
            this.underlineActivated = marks.underline && isMarkActive(state, marks.underline);

            this.activeForegroundColor = marks.textForegroundColor && findMarksInSelection(state, marks.textForegroundColor).map(mark => mark.attrs.color)
                .find(color => !!color);

            this.activeBackgroundColor = marks.textBackgroundColor && findMarksInSelection(state, marks.textBackgroundColor).map(mark => mark.attrs.color)
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
                {this.strongActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>}

            {this.marks.includes("emphasis") && <ion-item button detail={false} onClick={() => this.toggle("emphasis")}>
                <ion-label style={{fontStyle: "italic"}}>{translate(intl, "ionx/HtmlEditor#Italic|text")}</ion-label>
                {this.emphasisActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>}

            {this.marks.includes("underline") && <ion-item button detail={false} onClick={() => this.toggle("underline")}>
                <ion-label style={{textDecoration: "underline"}}>{intl.message`ionx/HtmlEditor#Underline|text`}</ion-label>
                {this.underlineActivated && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>}

            {this.marks.includes("textForegroundColor") && <ion-item detail={false}>
                <ion-label>{intl.message`ionx/HtmlEditor#Text color`}</ion-label>
                <input slot="end" type="color" value={this.activeForegroundColor || "#000000"} onInput={ev => this.toggleColor("textForegroundColor", (ev.target as HTMLInputElement).value)}/>
                {this.activeForegroundColor && <ion-button slot="end" fill="clear" size="small" onClick={() => this.toggleColor("textForegroundColor")}>
                    <ion-icon name="backspace" slot="icon-only" size="small"/>
                </ion-button>}
            </ion-item>}

            {this.marks.includes("textBackgroundColor") && <ion-item detail={false}>
                <ion-label>{intl.message`ionx/HtmlEditor#Background color`}</ion-label>
                <input slot="end" type="color" value={this.activeBackgroundColor || "#000000"} onInput={ev => this.toggleColor("textBackgroundColor", (ev.target as HTMLInputElement).value)}/>
                {this.activeBackgroundColor && <ion-button slot="end" fill="clear" size="small" onClick={() => this.toggleColor("textBackgroundColor")}>
                    <ion-icon name="backspace" slot="icon-only" size="small"/>
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
