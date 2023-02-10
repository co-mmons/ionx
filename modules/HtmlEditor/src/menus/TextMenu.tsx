import {intl, MessageRef, translate} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core/components";
import {Component, Fragment, h, Prop, State} from "@stencil/core";
import {toggleMark} from "prosemirror-commands";
import {isMarkActive} from "../prosemirror/active";
import {toggleInlineMark} from "../prosemirror/commands/toogleInlineMark";
import {findMarksInSelection} from "../prosemirror/utils/findMarksInSelection";
import {isMarkFromGroup} from "../prosemirror/utils/isMarkFromGroup";
import {FontSize} from "./FontSize";

const simpleMarks = [
    {name: "strong", style: {fontWeight: "bold"}, label: new MessageRef("ionx/HtmlEditor", "Bold|text")},
    {name: "emphasis", style: {fontStyle: "italic"}, label: new MessageRef("ionx/HtmlEditor", "Italic|text")},
    {name: "underline", style: {textDecoration: "underline"}, label: new MessageRef("ionx/HtmlEditor", "Underline|text")},
    {name: "strikethrough", style: {textDecoration: "line-through"}, label: new MessageRef("ionx/HtmlEditor", "Strikethrough|text")},
    {name: "superscript", label: new MessageRef("ionx/HtmlEditor", "Superscript|text"), sublabel: `<sup>xyz</sup>`},
    {name: "subscript", label: new MessageRef("ionx/HtmlEditor", "Subscript|text"), sublabel: `<sub>xyz</sub>`}
]

@Component({
    tag: "ionx-html-editor-text-menu",
    styleUrl: "TextMenu.scss",
    shadow: true
})
export class TextMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    activeFontSize: FontSize;

    marks: string[];

    activeMarks: string[];

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

        await popoverController.dismiss();
        view.focus();
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

        await popoverController.dismiss();
        view.focus();
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
            await popoverController.dismiss();
            view.focus();
        }
    }

    connectedCallback() {

        this.editor.getView().then(view => {

            const {state} = view;
            const {marks} = state.schema;

            this.activeMarks = [];
            this.marks = [];

            for (const [markName, mark] of Object.entries(marks)) {
                if (isMarkFromGroup(mark, "textFormat")) {
                    this.marks.push(markName);

                    if (isMarkActive(state, mark)) {
                        this.activeMarks.push(markName);
                    }
                }
            }

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

            {simpleMarks.map(mark => this.marks.includes(mark.name) && <ion-item button detail={false} onClick={() => this.toggle(mark.name)}>
                <ion-label style={mark.style}>{translate(intl, mark.label)}{mark.sublabel && <span innerHTML={mark.sublabel}/>}</ion-label>
                {this.activeMarks.includes(mark.name) && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>)}

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
