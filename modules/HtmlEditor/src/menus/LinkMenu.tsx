import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core";
import {Component, h, Listen, Prop} from "@stencil/core";
import {defineIonxLinkEditor, showLinkEditor} from "ionx/LinkEditor";
import {toggleMark} from "prosemirror-commands";
import {Schema} from "prosemirror-model";
import {findMarksInSelection} from "../prosemirror/utils/findMarksInSelection";
import {findNodeStartEnd} from "../prosemirror/utils/findNodeStartEnd";
import {LinkMark} from "../schema";

defineIonxLinkEditor();

@Component({
    tag: "ionx-html-editor-link-menu",
    styleUrl: "LinkMenu.scss",
    shadow: true
})
export class LinkMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    async edit() {

        const view = await this.editor.getView();
        const schema = view.state.schema as Schema;
        const linkMark = schema.marks.link;
        const linkSpec = linkMark.spec;

        MARKS: for (const mark of findMarksInSelection(view.state, linkMark)) {
            const href = mark.attrs.href;
            const target = mark.attrs.target;
            if (href) {
                await popoverController.dismiss();

                const linkSchemes = linkSpec instanceof LinkMark ? linkSpec.schemes : undefined;

                const link = await showLinkEditor({value: {href, target}, schemes: linkSchemes});
                if (link) {

                    const selection = view.state.selection;
                    const tr = view.state.tr;

                    tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                        if (node.isText) {
                            const {start, end} = findNodeStartEnd(tr.doc, pos);
                            tr.addMark(start, end, view.state.schema.mark(linkMark, link));
                        }
                    });

                    view.dispatch(tr);

                }
                break MARKS;
            }
        }

    }

    async unlink() {
        const view = await this.editor.getView();
        const selection = view.state.selection;

        if (selection.empty) {

            const tr = view.state.tr;

            tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {

                if (node.isText) {
                    const $pos = tr.doc.resolve(pos);
                    const start = pos - $pos.textOffset;
                    const end = start + $pos.parent.child($pos.index()).nodeSize;

                    tr.removeMark(start, end, view.state.schema.marks.LinkMark);
                }
            });

            view.dispatch(tr);

        } else {
            toggleMark(view.state.schema.marks.LinkMark)(view.state, tr => view.dispatch(tr));
        }

        popoverController.dismiss();
    }

    @Listen("ionViewDidLeave")
    didDismiss() {
        this.editor.setFocus();
    }

    render() {
        return <ion-list lines="full">

            <ion-item button detail={false} onClick={() => this.edit()}>
                <ion-icon name="link-outline" slot="start"/>
                <ion-label>{intl.message`@co.mmons/js-intl#Edit|command`}</ion-label>
            </ion-item>

            <ion-item button detail={false} onClick={() => this.unlink()}>
                <ion-icon name="unlink-outline" slot="start"/>
                <ion-label>{intl.message`@co.mmons/js-intl#Delete|command`}</ion-label>
            </ion-item>

        </ion-list>
    }
}
