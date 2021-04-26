import {intl} from "@co.mmons/js-intl";
import {isPlatform, popoverController} from "@ionic/core";
import {Component, Element, h, Host, Prop, State} from "@stencil/core";
import {addEventListener, EventUnlisten} from "ionx/utils";
import {redo, redoDepth, undo, undoDepth} from "prosemirror-history";
import {findParentNode, findParentNodeOfType} from "prosemirror-utils";
import {HtmlEditorFeatures} from "./HtmlEditorFeatures";
import {anyMarkActive, isMarkActive} from "./prosemirror/active";
import {schema} from "./prosemirror/schema";
import {isBlockMarkActive} from "./prosemirror/utils/selection/isBlockMarkActive";

@Component({
    tag: "ionx-html-editor-toolbar",
    styleUrl: "Toolbar.scss",
    scoped: true
})
export class Toolbar {

    @Element()
    element: HTMLElement;

    @Prop()
    features: HtmlEditorFeatures;

    private selectionUnlisten: EventUnlisten;

    @State()
    private activeFeatures: {
        link?: boolean,
        text?: boolean,
        alignment?: boolean,
        heading?: boolean;
        list?: boolean
    } = {};

    @State()
    private canUndo: boolean;

    @State()
    private canRedo: boolean;

    private get editor() {
        return this.element.parentElement as HTMLIonxHtmlEditorElement;
    }

    private async undo() {

        const view = await this.editor.getView();

        undo(view.state, t => view.updateState(view.state.apply(t)));

        this.canUndo = undoDepth(view.state) > 0;
        this.canRedo = redoDepth(view.state) > 0;

        this.editor.setFocus();
    }

    private async redo() {

        const view = await this.editor.getView();

        redo(view.state, t => view.updateState(view.state.apply(t)));

        this.canUndo = undoDepth(view.state) > 0;
        this.canRedo = redoDepth(view.state) > 0;

        this.editor.setFocus();
    }

    editLink() {

    }

    async showMenu(event: Event, menu: string) {

        const popover = await popoverController.create({
            component: `ionx-html-editor-${menu}-menu`,
            componentProps: {
                editor: this.editor
            },
            event: event as any,
            showBackdrop: isPlatform("ios")
        });

        await popover.present();
        popover.animated = false;
    }

    async editorSelectionChanged() {

        const view = await this.editor.getView();

        this.canUndo = undoDepth(view.state) > 0;
        this.canRedo = redoDepth(view.state) > 0;

        this.activeFeatures = {};
        this.activeFeatures.text = anyMarkActive(view.state, [schema.marks.strong, schema.marks.em, schema.marks.underline, schema.marks.fontSize]);
        this.activeFeatures.list = !!findParentNode(predicate => predicate.hasMarkup(schema.nodes.orderedList) || predicate.hasMarkup(schema.nodes.bulletList))(view.state.selection);
        this.activeFeatures.alignment = isBlockMarkActive(view.state, schema.marks.alignment);
        this.activeFeatures.heading = !!findParentNodeOfType(schema.nodes.heading)(view.state.selection);
        this.activeFeatures.link = isMarkActive(view.state, schema.marks.link);
    }

    connectedCallback() {
        this.selectionUnlisten = addEventListener(this.editor, "editorSelectionChange", () => this.editorSelectionChanged());
        this.editorSelectionChanged();
    }

    disconnectedCallback() {
        this.selectionUnlisten?.();
    }

    render() {
        return <Host>

            <ion-button
                size="small"
                fill="clear"
                class={{"active-feature": this.activeFeatures.text}}
                onClick={ev => this.showMenu(ev, "text")}>
                <ion-icon name="caret-down" slot="end"/>
                <span>{intl.message`ionx/HtmlEditor#Text`}</span>
            </ion-button>

            {this.features?.alignment !== false && <ion-button
                size="small"
                fill="clear"
                class={{"active-feature": this.activeFeatures.alignment}}
                onClick={ev => this.showMenu(ev, "alignment")}>
                <ion-icon name="caret-down" slot="end"/>
                <span>{intl.message`ionx/HtmlEditor#Alignment`}</span>
            </ion-button>}

            {this.features?.heading !== false && <ion-button
                size="small"
                fill="clear"
                class={{"active-feature": this.activeFeatures.heading}}
                onClick={ev => this.showMenu(ev, "heading")}>
                <ion-icon name="caret-down" slot="end"/>
                <span>{intl.message`ionx/HtmlEditor#Heading`}</span>
            </ion-button>}

            {this.features?.list !== false && <ion-button
                size="small"
                fill="clear"
                class={{"active-feature": this.activeFeatures.list}}
                onClick={ev => this.showMenu(ev, "list")}>
                <ion-icon name="caret-down" slot="end"/>
                <span>{intl.message`ionx/HtmlEditor#listMenu/List`}</span>
            </ion-button>}

            {this.features?.link !== false && <ion-button
                size="small"
                fill="clear"
                onClick={ev => this.showMenu(ev, "insert")}>
                <ion-icon name="caret-down" slot="end"/>
                <span>{intl.message`ionx/HtmlEditor#Insert`}</span>
            </ion-button>}

            {this.activeFeatures.link && <ion-button
                size="small"
                fill="clear"
                class="active-feature"
                onClick={() => this.editLink()}>
                <span>{intl.message`ionx/HtmlEditor#link/Link`}</span>
            </ion-button>}

            <div class="buttons-group">

                <ion-button
                    size="small"
                    fill="clear"
                    tabindex="-1"
                    disabled={!this.canUndo}
                    title={intl.message`ionx/HtmlEditor#Undo`}
                    onClick={() => this.undo()}>
                    <ion-icon src="/assets/ionx.HtmlEditor/icons/undo.svg" slot="icon-only"/>
                </ion-button>

                <ion-button
                    size="small"
                    fill="clear"
                    tabindex="-1"
                    disabled={!this.canRedo}
                    title={intl.message`ionx/HtmlEditor#Redo`}
                    onClick={() => this.redo()}>
                    <ion-icon src="/assets/ionx.HtmlEditor/icons/redo.svg" slot="icon-only"/>
                </ion-button>

            </div>

        </Host>
    }
}
