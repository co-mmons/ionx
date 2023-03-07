/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Link } from "./Link";
import { SelectItem } from "ionx/Select";
import { LinkScheme } from "./LinkScheme";
import { LinkEditorProps } from "./LinkEditorProps";
export namespace Components {
    interface IonxLinkEditor {
        "buildLink": () => Promise<Link>;
        "disabled": boolean;
        "empty": boolean;
        "placeholder": string;
        "readonly": boolean;
        "schemes"?: SelectItem[] | LinkScheme[];
        "targetVisible": boolean;
        "value": string | Link;
    }
    interface IonxLinkEditorDialog {
        "editorProps": LinkEditorProps;
    }
}
declare global {
    interface HTMLIonxLinkEditorElement extends Components.IonxLinkEditor, HTMLStencilElement {
    }
    var HTMLIonxLinkEditorElement: {
        prototype: HTMLIonxLinkEditorElement;
        new (): HTMLIonxLinkEditorElement;
    };
    interface HTMLIonxLinkEditorDialogElement extends Components.IonxLinkEditorDialog, HTMLStencilElement {
    }
    var HTMLIonxLinkEditorDialogElement: {
        prototype: HTMLIonxLinkEditorDialogElement;
        new (): HTMLIonxLinkEditorDialogElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-link-editor": HTMLIonxLinkEditorElement;
        "ionx-link-editor-dialog": HTMLIonxLinkEditorDialogElement;
    }
}
declare namespace LocalJSX {
    interface IonxLinkEditor {
        "disabled"?: boolean;
        "empty"?: boolean;
        "onIonChange"?: (event: CustomEvent<{value: Link}>) => void;
        "placeholder"?: string;
        "readonly"?: boolean;
        "schemes"?: SelectItem[] | LinkScheme[];
        "targetVisible"?: boolean;
        "value"?: string | Link;
    }
    interface IonxLinkEditorDialog {
        "editorProps"?: LinkEditorProps;
    }
    interface IntrinsicElements {
        "ionx-link-editor": IonxLinkEditor;
        "ionx-link-editor-dialog": IonxLinkEditorDialog;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-link-editor": LocalJSX.IonxLinkEditor & JSXBase.HTMLAttributes<HTMLIonxLinkEditorElement>;
            "ionx-link-editor-dialog": LocalJSX.IonxLinkEditorDialog & JSXBase.HTMLAttributes<HTMLIonxLinkEditorDialogElement>;
        }
    }
}
