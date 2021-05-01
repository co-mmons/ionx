/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { EditorView } from "prosemirror-view";
import { HtmlEditorFeatures } from "./HtmlEditorFeatures";
export namespace Components {
    interface IonxHtmlEditor {
        "disabled": boolean;
        "getView": () => Promise<EditorView<any>>;
        "readonly": boolean;
        "setFocus": () => Promise<void>;
        "value": string;
    }
    interface IonxHtmlEditorAlignmentMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorInsertMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorLinkMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorListMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorParagraphMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorTextMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorToolbar {
        "features": HtmlEditorFeatures;
    }
}
declare global {
    interface HTMLIonxHtmlEditorElement extends Components.IonxHtmlEditor, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorElement: {
        prototype: HTMLIonxHtmlEditorElement;
        new (): HTMLIonxHtmlEditorElement;
    };
    interface HTMLIonxHtmlEditorAlignmentMenuElement extends Components.IonxHtmlEditorAlignmentMenu, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorAlignmentMenuElement: {
        prototype: HTMLIonxHtmlEditorAlignmentMenuElement;
        new (): HTMLIonxHtmlEditorAlignmentMenuElement;
    };
    interface HTMLIonxHtmlEditorInsertMenuElement extends Components.IonxHtmlEditorInsertMenu, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorInsertMenuElement: {
        prototype: HTMLIonxHtmlEditorInsertMenuElement;
        new (): HTMLIonxHtmlEditorInsertMenuElement;
    };
    interface HTMLIonxHtmlEditorLinkMenuElement extends Components.IonxHtmlEditorLinkMenu, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorLinkMenuElement: {
        prototype: HTMLIonxHtmlEditorLinkMenuElement;
        new (): HTMLIonxHtmlEditorLinkMenuElement;
    };
    interface HTMLIonxHtmlEditorListMenuElement extends Components.IonxHtmlEditorListMenu, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorListMenuElement: {
        prototype: HTMLIonxHtmlEditorListMenuElement;
        new (): HTMLIonxHtmlEditorListMenuElement;
    };
    interface HTMLIonxHtmlEditorParagraphMenuElement extends Components.IonxHtmlEditorParagraphMenu, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorParagraphMenuElement: {
        prototype: HTMLIonxHtmlEditorParagraphMenuElement;
        new (): HTMLIonxHtmlEditorParagraphMenuElement;
    };
    interface HTMLIonxHtmlEditorTextMenuElement extends Components.IonxHtmlEditorTextMenu, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorTextMenuElement: {
        prototype: HTMLIonxHtmlEditorTextMenuElement;
        new (): HTMLIonxHtmlEditorTextMenuElement;
    };
    interface HTMLIonxHtmlEditorToolbarElement extends Components.IonxHtmlEditorToolbar, HTMLStencilElement {
    }
    var HTMLIonxHtmlEditorToolbarElement: {
        prototype: HTMLIonxHtmlEditorToolbarElement;
        new (): HTMLIonxHtmlEditorToolbarElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-html-editor": HTMLIonxHtmlEditorElement;
        "ionx-html-editor-alignment-menu": HTMLIonxHtmlEditorAlignmentMenuElement;
        "ionx-html-editor-insert-menu": HTMLIonxHtmlEditorInsertMenuElement;
        "ionx-html-editor-link-menu": HTMLIonxHtmlEditorLinkMenuElement;
        "ionx-html-editor-list-menu": HTMLIonxHtmlEditorListMenuElement;
        "ionx-html-editor-paragraph-menu": HTMLIonxHtmlEditorParagraphMenuElement;
        "ionx-html-editor-text-menu": HTMLIonxHtmlEditorTextMenuElement;
        "ionx-html-editor-toolbar": HTMLIonxHtmlEditorToolbarElement;
    }
}
declare namespace LocalJSX {
    interface IonxHtmlEditor {
        "disabled"?: boolean;
        "onEditorSelectionChange"?: (event: CustomEvent<any>) => void;
        "onIonChange"?: (event: CustomEvent<{value: string}>) => void;
        "readonly"?: boolean;
        "value"?: string;
    }
    interface IonxHtmlEditorAlignmentMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorInsertMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorLinkMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorListMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorParagraphMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorTextMenu {
        "editor": HTMLIonxHtmlEditorElement;
    }
    interface IonxHtmlEditorToolbar {
        "features"?: HtmlEditorFeatures;
    }
    interface IntrinsicElements {
        "ionx-html-editor": IonxHtmlEditor;
        "ionx-html-editor-alignment-menu": IonxHtmlEditorAlignmentMenu;
        "ionx-html-editor-insert-menu": IonxHtmlEditorInsertMenu;
        "ionx-html-editor-link-menu": IonxHtmlEditorLinkMenu;
        "ionx-html-editor-list-menu": IonxHtmlEditorListMenu;
        "ionx-html-editor-paragraph-menu": IonxHtmlEditorParagraphMenu;
        "ionx-html-editor-text-menu": IonxHtmlEditorTextMenu;
        "ionx-html-editor-toolbar": IonxHtmlEditorToolbar;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-html-editor": LocalJSX.IonxHtmlEditor & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorElement>;
            "ionx-html-editor-alignment-menu": LocalJSX.IonxHtmlEditorAlignmentMenu & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorAlignmentMenuElement>;
            "ionx-html-editor-insert-menu": LocalJSX.IonxHtmlEditorInsertMenu & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorInsertMenuElement>;
            "ionx-html-editor-link-menu": LocalJSX.IonxHtmlEditorLinkMenu & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorLinkMenuElement>;
            "ionx-html-editor-list-menu": LocalJSX.IonxHtmlEditorListMenu & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorListMenuElement>;
            "ionx-html-editor-paragraph-menu": LocalJSX.IonxHtmlEditorParagraphMenu & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorParagraphMenuElement>;
            "ionx-html-editor-text-menu": LocalJSX.IonxHtmlEditorTextMenu & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorTextMenuElement>;
            "ionx-html-editor-toolbar": LocalJSX.IonxHtmlEditorToolbar & JSXBase.HTMLAttributes<HTMLIonxHtmlEditorToolbarElement>;
        }
    }
}