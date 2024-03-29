/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { HtmlString } from "@co.mmons/js-utils/core";
import { DialogButton } from "./DialogButton";
import { OverlayEventDetail } from "@ionic/core/components";
import { DialogValue } from "./DialogValue";
export namespace Components {
    interface IonxDialog {
        /**
          * @inheritDoc
         */
        "buttons"?: DialogButton[];
        "clickButton": (role: string) => Promise<void>;
        /**
          * Name of the tag, that should be displayed inside....
          * @inheritDoc
         */
        "component"?: string;
        /**
          * @inheritDoc
         */
        "componentProps"?: {[prop: string]: any};
        /**
          * @inheritDoc
         */
        "header"?: string;
        /**
          * @inheritDoc
         */
        "message"?: string | HtmlString;
        /**
          * @inheritDoc
         */
        "messageComponent"?: string;
        /**
          * @inheritDoc
         */
        "messageComponentProps"?: {[prop: string]: any};
        "onDidDismiss": () => Promise<OverlayEventDetail<any>>;
        /**
          * A promise resolved when dialog was fully presented.
         */
        "onDidEnter": () => Promise<true>;
        "onWillDismiss": () => Promise<OverlayEventDetail<any>>;
        "prefetch": boolean;
        /**
          * @inheritDoc
         */
        "subheader"?: string;
    }
    interface IonxDialogButtons {
        "buttonClicked": (button: DialogButton) => Promise<void>;
        "buttons": DialogButton[];
    }
    interface IonxDialogContent {
    }
    interface IonxDialogHeaders {
        "header"?: string;
        "subheader"?: string;
    }
    interface IonxDialogMessage {
        "message"?: string | HtmlString;
    }
}
declare global {
    interface HTMLIonxDialogElement extends Components.IonxDialog, HTMLStencilElement {
    }
    var HTMLIonxDialogElement: {
        prototype: HTMLIonxDialogElement;
        new (): HTMLIonxDialogElement;
    };
    interface HTMLIonxDialogButtonsElement extends Components.IonxDialogButtons, HTMLStencilElement {
    }
    var HTMLIonxDialogButtonsElement: {
        prototype: HTMLIonxDialogButtonsElement;
        new (): HTMLIonxDialogButtonsElement;
    };
    interface HTMLIonxDialogContentElement extends Components.IonxDialogContent, HTMLStencilElement {
    }
    var HTMLIonxDialogContentElement: {
        prototype: HTMLIonxDialogContentElement;
        new (): HTMLIonxDialogContentElement;
    };
    interface HTMLIonxDialogHeadersElement extends Components.IonxDialogHeaders, HTMLStencilElement {
    }
    var HTMLIonxDialogHeadersElement: {
        prototype: HTMLIonxDialogHeadersElement;
        new (): HTMLIonxDialogHeadersElement;
    };
    interface HTMLIonxDialogMessageElement extends Components.IonxDialogMessage, HTMLStencilElement {
    }
    var HTMLIonxDialogMessageElement: {
        prototype: HTMLIonxDialogMessageElement;
        new (): HTMLIonxDialogMessageElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-dialog": HTMLIonxDialogElement;
        "ionx-dialog-buttons": HTMLIonxDialogButtonsElement;
        "ionx-dialog-content": HTMLIonxDialogContentElement;
        "ionx-dialog-headers": HTMLIonxDialogHeadersElement;
        "ionx-dialog-message": HTMLIonxDialogMessageElement;
    }
}
declare namespace LocalJSX {
    interface IonxDialog {
        /**
          * @inheritDoc
         */
        "buttons"?: DialogButton[];
        /**
          * Name of the tag, that should be displayed inside....
          * @inheritDoc
         */
        "component"?: string;
        /**
          * @inheritDoc
         */
        "componentProps"?: {[prop: string]: any};
        /**
          * @inheritDoc
         */
        "header"?: string;
        /**
          * @inheritDoc
         */
        "message"?: string | HtmlString;
        /**
          * @inheritDoc
         */
        "messageComponent"?: string;
        /**
          * @inheritDoc
         */
        "messageComponentProps"?: {[prop: string]: any};
        "prefetch"?: boolean;
        /**
          * @inheritDoc
         */
        "subheader"?: string;
    }
    interface IonxDialogButtons {
        "buttons": DialogButton[];
    }
    interface IonxDialogContent {
    }
    interface IonxDialogHeaders {
        "header"?: string;
        "subheader"?: string;
    }
    interface IonxDialogMessage {
        "message"?: string | HtmlString;
    }
    interface IntrinsicElements {
        "ionx-dialog": IonxDialog;
        "ionx-dialog-buttons": IonxDialogButtons;
        "ionx-dialog-content": IonxDialogContent;
        "ionx-dialog-headers": IonxDialogHeaders;
        "ionx-dialog-message": IonxDialogMessage;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-dialog": LocalJSX.IonxDialog & JSXBase.HTMLAttributes<HTMLIonxDialogElement>;
            "ionx-dialog-buttons": LocalJSX.IonxDialogButtons & JSXBase.HTMLAttributes<HTMLIonxDialogButtonsElement>;
            "ionx-dialog-content": LocalJSX.IonxDialogContent & JSXBase.HTMLAttributes<HTMLIonxDialogContentElement>;
            "ionx-dialog-headers": LocalJSX.IonxDialogHeaders & JSXBase.HTMLAttributes<HTMLIonxDialogHeadersElement>;
            "ionx-dialog-message": LocalJSX.IonxDialogMessage & JSXBase.HTMLAttributes<HTMLIonxDialogMessageElement>;
        }
    }
}
