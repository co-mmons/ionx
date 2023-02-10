import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core/components";
import {Component, Fragment, h, Prop} from "@stencil/core";
import {findParentNode} from "prosemirror-utils";
import {Command} from "../prosemirror/command";
import {indentList, outdentList, toggleList} from "../prosemirror/list-commands";

@Component({
    tag: "ionx-html-editor-list-menu",
    styleUrl: "ListMenu.scss",
    shadow: true
})
export class ListMenu {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    activeBulletList: boolean;
    activeNumberedList: boolean;

    async level(level: number) {

        const view = await this.editor.getView();
        const {state} = view;

        const command: Command = level < 0 ? outdentList() : indentList();
        if (command(state)) {
            command(state, t => view.dispatch(t));
        }

        await popoverController.dismiss();
        view.focus();
    }

    async toggleList(type: "bulletList" | "orderedList") {
        const view = await this.editor.getView();
        toggleList(view.state, t => view.dispatch(t), view, type);
        await popoverController.dismiss();
        view.focus();
    }

    connectedCallback() {

        this.editor.getView().then(view => {

            const {selection, schema} = view.state;

            this.activeBulletList = !!findParentNode(predicate => predicate.hasMarkup(schema.nodes.bulletList))(selection);
            this.activeNumberedList = !!findParentNode(predicate => predicate.hasMarkup(schema.nodes.orderedList))(selection);
        });
    }

    render() {
        return <ion-list lines="full">

            <ion-item button detail={false} onClick={() => this.toggleList("bulletList")}>
                <ion-label>{intl.message`ionx/HtmlEditor#listMenu/Bulleted list`}</ion-label>
                <ion-icon src="/assets/ionx.HtmlEditor/icons/list-bulleted.svg" slot="start"/>
                {this.activeBulletList && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>

            <ion-item button detail={false} onClick={() => this.toggleList("orderedList")}>
                <ion-label>{intl.message`ionx/HtmlEditor#listMenu/Numbered list`}</ion-label>
                <ion-icon src="/assets/ionx.HtmlEditor/icons/list-numbered.svg" slot="start"/>
                {this.activeNumberedList && <ion-icon name="checkmark" slot="end"/>}
            </ion-item>

            {(this.activeNumberedList || this.activeBulletList) && <Fragment>

                <ion-item-divider>
                    <ion-label>{intl.message`ionx/HtmlEditor#listMenu/Indent`}</ion-label>
                </ion-item-divider>

                <ion-item button={true} detail={false} onClick={() => this.level(-1)}>
                    <ion-label>{intl.message`ionx/HtmlEditor#listMenu/Decrease indent`}</ion-label>
                    <ion-icon src="/assets/ionx.HtmlEditor/icons/indent-decrease.svg" slot="start"/>
                </ion-item>

                <ion-item button={true} detail={false} onClick={() => this.level(1)}>
                    <ion-label>{intl.message`ionx/HtmlEditor#listMenu/Increase indent`}</ion-label>
                    <ion-icon src="/assets/ionx.HtmlEditor/icons/indent-increase.svg" slot="start"/>
                </ion-item>

            </Fragment>}

        </ion-list>
    }
}
