import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core/components";
import {Component, h, Prop} from "@stencil/core";
import {changeAlignment} from "../prosemirror/alignment/commands";
import {findBlockMarks} from "../prosemirror/utils/selection/findBlockMarks";
import {Alignment} from "./Alignment";

@Component({
    tag: "ionx-html-editor-alignment-menu",
    styleUrl: "AlignmentMenu.scss",
    shadow: true
})
export class AlignmentMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    active: string;

    async toggleAlignment(alignment: Alignment) {

        const view = await this.editor.getView();
        const command = changeAlignment(alignment.name);

        if (command(view.state)) {
            command(view.state, (tr) => view.dispatch(tr));
        }

        await popoverController.dismiss();
        view.focus();
    }

    connectedCallback() {

        this.active = undefined;

        this.editor.getView().then(view => {

            const {state} = view;
            const {marks} = state.schema;

            for (const mark of findBlockMarks(state, marks.alignment)) {

                // zaznaczonych wiele blocków z różnym wyrównaniem
                if (this.active && this.active !== mark.attrs.align) {
                    this.active = undefined;
                    break;
                }

                this.active = mark.attrs.align;
            }
        });
    }

    render() {
        return <ion-list lines="full">
            {Alignment.values().map(alignment => <ion-item button detail={false} onClick={() => this.toggleAlignment(alignment)}>
                <ion-label>{intl.message(alignment.label)}</ion-label>
                {this.active === alignment.name && <ion-icon name="checkmark" slot="end"/>}
                <ion-icon src={`/assets/ionx.HtmlEditor/icons/align-${alignment.name}.svg`} slot="start"/>
            </ion-item>)}
        </ion-list>
    }
}
