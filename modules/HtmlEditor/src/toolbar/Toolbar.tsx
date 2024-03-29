import {intl, MessageRef, translate} from "@co.mmons/js-intl";
import {createAnimation, isPlatform, popoverController} from "@ionic/core/components";
import {defineCustomElement as defineButton} from "@ionic/core/components/ion-button";
import {defineCustomElement as definePopover} from "@ionic/core/components/ion-popover";
import {Component, ComponentInterface, Element, forceUpdate, h, Host, Prop} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {defineCustomElement as defineIcon} from "ionicons/components/ion-icon";
import {addEventListener, EventUnlisten} from "ionx/utils";
import {redo, redoDepth, undo, undoDepth} from "prosemirror-history";
import {EditorView} from "prosemirror-view";
import {ToolbarItem} from "./ToolbarItem";

defineButton();
defineIcon();
definePopover();

interface Button {
    labelVisible: boolean;
    iconVisible: boolean;
    label: string;
    iconSrc: string;
    iconName: string;
    active: boolean;
    menuComponent: string;
    menuComponentProps: any | ((view: EditorView) => any | Promise<any>);
    handler: (view: EditorView) => any;
}

@Component({
    tag: "ionx-html-editor-toolbar",
    styleUrl: "Toolbar.scss",
    scoped: true
})
export class Toolbar implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    historyDisabled: boolean;

    @Prop()
    items: ToolbarItem[];

    private selectionUnlisten: EventUnlisten;

    private canUndo = false;

    private canRedo = false;

    private buttons: Button[];

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

    async showMenu(view: EditorView, item: ToolbarItem) {

        const popover = await popoverController.create({
            component: item.menuComponent,
            componentProps: {
                ...(typeof item.menuComponentProps === "function" ? await item.menuComponentProps(view) : (item.menuComponentProps ?? {})),
                editor: this.editor,
            },
            event,
            showBackdrop: isPlatform("ios"),
            leaveAnimation: () => createAnimation()
        });

        popover.style.setProperty("--width", "auto");
        popover.style.setProperty("--height", "auto");
        popover.style.setProperty("--max-width", "80vw");
        popover.style.setProperty("--max-height", "80vh");

        await popover.present();

        const dismiss = await popover.onDidDismiss();
        if (dismiss.role === "backdrop") {
            view.focus();
        }
    }

    async handleItemClick(_event: MouseEvent, item: Button) {

        const view = await this.editor.getView();

        if (item.menuComponent) {
            this.showMenu(view, item);
        } else if (item.handler) {
            try {
                let result = item.handler(view);
                if (result instanceof Promise) {
                    result = await result;
                }

                if (result !== false) {
                    view.focus();
                }

            } catch (e) {
                console.error(e);
            }
        }

    }

    async forceUpdate(onlyIfChange = false) {

        const view = await this.editor.getView();
        if (!view) {
            return;
        }

        const wasCanUndo = this.canUndo;
        const wasCanRedo = this.canRedo;
        const prevButtons = this.buttons;

        this.canUndo = undoDepth(view.state) > 0;
        this.canRedo = redoDepth(view.state) > 0;

        this.buttons = this.items?.filter(item => !item.isVisible || item.isVisible(view)).map(item => ({
            labelVisible: item.labelVisible,
            iconVisible: item.iconVisible,
            label: item.label instanceof MessageRef ? translate(intl, item.label) : item.label,
            active: item.isActive?.(view) || false,
            iconName: item.iconName,
            iconSrc: item.iconSrc,
            menuComponent: item.menuComponent,
            menuComponentProps: typeof item.menuComponentProps === "function" ? item.menuComponentProps.bind(item) : item.menuComponentProps,
            handler: item.handler ? item.handler.bind(item) : undefined
        }));

        if (!onlyIfChange || wasCanUndo !== this.canUndo || wasCanRedo !== this.canRedo || !deepEqual(this.buttons, prevButtons)) {
            forceUpdate(this);
        }
    }

    async editorSelectionChanged() {
        await this.forceUpdate(true);
    }

    async componentDidLoad() {
        await this.forceUpdate(true);
    }

    connectedCallback() {
        this.selectionUnlisten = addEventListener(this.editor, "editorSelectionChange", () => this.editorSelectionChanged());
    }

    disconnectedCallback() {
        this.selectionUnlisten?.();
    }

    render() {
        return <Host>

            {this.buttons?.map(item => <ion-button
                size="small"
                fill={item.active ? "outline" : "clear"}
                onClick={ev => this.handleItemClick(ev, item)}>

                {(item.iconSrc || item.iconName) && item.iconVisible !== false && <ion-icon
                    name={item.iconName}
                    src={item.iconSrc}
                    slot={item.labelVisible !== false ? "start" : "icon-only"}
                    size={item.labelVisible !== false ? "small" : undefined}/>}

                {item.menuComponent && <ion-icon name="caret-down" slot="end"/>}

                {item.labelVisible !== false && <span>{item.label}</span>}
            </ion-button>)}

            {!this.historyDisabled && <div class="buttons-group">

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

            </div>}

        </Host>
    }
}
