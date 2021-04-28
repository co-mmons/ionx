import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core";
import {Component, ComponentInterface, h, Listen, Prop} from "@stencil/core";
import {defineIonxLinkEditor, showLinkEditor} from "ionx/LinkEditor";
import {schema} from "./prosemirror/schema";
import {findMarksInSelection} from "./prosemirror/utils/findMarksInSelection";
import {findNodeStartEnd} from "./prosemirror/utils/findNodeStartEnd";

@Component({
    tag: "ionx-html-editor-insert-menu",
    styleUrl: "InsertMenu.scss",
    shadow: true
})
export class InsertMenu implements ComponentInterface {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    selectionEmpty: boolean;

    async link() {

        await popoverController.dismiss();

        defineIonxLinkEditor();

        const view = await this.editor.getView();
        let href: string;
        let target: string;

        for (const mark of findMarksInSelection(view.state, schema.marks.link)) {
            const h = mark.attrs.href;
            const t = mark.attrs.target;
            if (h) {
                href = h;
                target = t;
                break;
            }
        }

        const link = await showLinkEditor({link: href ? {href, target} : undefined});
        if (link) {

            const selection = view.state.selection;
            const tr = view.state.tr;

            tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                if (node.isText) {
                    const {start, end} = findNodeStartEnd(tr.doc, pos);
                    tr.addMark(start, end, schema.mark(schema.marks.link, link));
                }
            });

            view.dispatch(tr);
        }
    }

    @Listen("ionViewDidLeave")
    didDismiss() {
        this.editor.setFocus();
    }

    async componentWillLoad() {
        const view = await this.editor.getView()
        this.selectionEmpty = view.state.selection.empty;
    }

    render() {
        return <ion-list lines="full">

            <ion-item button disabled={this.selectionEmpty} detail={false} onClick={() => this.link()}>
                <ion-icon name="link-outline" slot="start"/>
                <ion-label>
                    <div>{intl.message`ionx/LinkEditor#Link`}</div>
                    {this.selectionEmpty && <small><ion-text color="danger">{intl.message`ionx/HtmlEditor#selectTextToInsertLink`}</ion-text></small>}
                </ion-label>
            </ion-item>

        </ion-list>
    }
}
