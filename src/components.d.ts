/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { AnimationBuilder, RouterDirection, RouterEventDetail, TextFieldTypes } from "@ionic/core";
import { DialogButton } from "./components/Dialog/DialogButton";
export namespace Components {
    interface IonRouter {
        /**
          * Go back to previous page in the window.history.
         */
        "back": () => Promise<void>;
        "canTransition": () => Promise<string | boolean>;
        "navChanged": (direction: RouterDirection) => Promise<boolean>;
        "printDebug": () => Promise<void>;
        /**
          * Navigate to the specified URL.
          * @param url The url to navigate to.
          * @param direction The direction of the animation. Defaults to `"forward"`.
         */
        "push": (url: string, direction?: RouterDirection, animation?: AnimationBuilder) => Promise<boolean>;
        /**
          * By default `ion-router` will match the routes at the root path ("/"). That can be changed when
         */
        "root": string;
        /**
          * The router can work in two "modes": - With hash: `/index.html#/path/to/page` - Without hash: `/path/to/page`  Using one or another might depend in the requirements of your app and/or where it"s deployed.  Usually "hash-less" navigation works better for SEO and it"s more user friendly too, but it might requires additional server-side configuration in order to properly work.  On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.  By default, this property is `true`, change to `false` to allow hash-less URLs.
         */
        "useHash": boolean;
    }
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
        "message"?: string;
        /**
          * @inheritDoc
         */
        "messageComponent"?: string;
        /**
          * @inheritDoc
         */
        "messageComponentProps"?: {[prop: string]: any};
        "onDidDismiss": () => Promise<any>;
        /**
          * A promise resolved when dialog was fully presented.
         */
        "onDidEnter": () => Promise<true>;
        "onWillDismiss": () => Promise<any>;
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
        "message": string;
    }
    interface IonxExpandingSearchbar {
        "expand": () => Promise<void>;
        "expanded": boolean;
    }
    interface IonxExpandingSearchbarParent {
    }
    interface IonxFormItem {
        "error": string;
        /**
          * This attributes determines the background and border color of the form item. By default, items have a clear background and no border.
         */
        "fill": "clear" | "solid" | "outline";
        "hint": string;
    }
    interface IonxLoading {
        "dismiss": () => Promise<void>;
        /**
          * If loading element should fill available space and center content both h and v.
         */
        "fill"?: boolean;
        "header"?: string;
        "message"?: string;
        "progressBuffer"?: number;
        "progressMessage"?: string;
        "progressPercent"?: number;
        "progressType"?: "determinate" | "indeterminate";
        "progressValue"?: number;
        /**
          * The type of loader.
          * @inheritDoc
         */
        "type": "spinner" | "progress";
    }
    interface IonxTagsInput {
        "canBackspaceRemove": boolean;
        "canEnterAdd": boolean;
        "hideRemove": boolean;
        "maxTags": number;
        "placeholder": string;
        "readonly": boolean;
        "separator": string;
        "sortFn": (a: string, b: string) => number;
        "sortable": boolean;
        "type": TextFieldTypes;
        "unique": boolean;
        "value": string[];
        "verifyFn": (tagSrt: string) => boolean;
    }
    interface IonxTestDialog {
    }
    interface IonxTestDialogContent {
    }
    interface IonxTestDialogMessage {
        "dialogValue": () => Promise<string>;
    }
    interface IonxTestExpandingSearchbar {
    }
    interface IonxTestHome {
    }
    interface IonxTestLoading {
    }
    interface IonxTestRoot {
    }
    interface IonxTestTagsInput {
    }
    interface IonxToggleLabels {
        "off": string;
        "on": string;
    }
}
declare global {
    interface HTMLIonRouterElement extends Components.IonRouter, HTMLStencilElement {
    }
    var HTMLIonRouterElement: {
        prototype: HTMLIonRouterElement;
        new (): HTMLIonRouterElement;
    };
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
    interface HTMLIonxExpandingSearchbarElement extends Components.IonxExpandingSearchbar, HTMLStencilElement {
    }
    var HTMLIonxExpandingSearchbarElement: {
        prototype: HTMLIonxExpandingSearchbarElement;
        new (): HTMLIonxExpandingSearchbarElement;
    };
    interface HTMLIonxExpandingSearchbarParentElement extends Components.IonxExpandingSearchbarParent, HTMLStencilElement {
    }
    var HTMLIonxExpandingSearchbarParentElement: {
        prototype: HTMLIonxExpandingSearchbarParentElement;
        new (): HTMLIonxExpandingSearchbarParentElement;
    };
    interface HTMLIonxFormItemElement extends Components.IonxFormItem, HTMLStencilElement {
    }
    var HTMLIonxFormItemElement: {
        prototype: HTMLIonxFormItemElement;
        new (): HTMLIonxFormItemElement;
    };
    interface HTMLIonxLoadingElement extends Components.IonxLoading, HTMLStencilElement {
    }
    var HTMLIonxLoadingElement: {
        prototype: HTMLIonxLoadingElement;
        new (): HTMLIonxLoadingElement;
    };
    interface HTMLIonxTagsInputElement extends Components.IonxTagsInput, HTMLStencilElement {
    }
    var HTMLIonxTagsInputElement: {
        prototype: HTMLIonxTagsInputElement;
        new (): HTMLIonxTagsInputElement;
    };
    interface HTMLIonxTestDialogElement extends Components.IonxTestDialog, HTMLStencilElement {
    }
    var HTMLIonxTestDialogElement: {
        prototype: HTMLIonxTestDialogElement;
        new (): HTMLIonxTestDialogElement;
    };
    interface HTMLIonxTestDialogContentElement extends Components.IonxTestDialogContent, HTMLStencilElement {
    }
    var HTMLIonxTestDialogContentElement: {
        prototype: HTMLIonxTestDialogContentElement;
        new (): HTMLIonxTestDialogContentElement;
    };
    interface HTMLIonxTestDialogMessageElement extends Components.IonxTestDialogMessage, HTMLStencilElement {
    }
    var HTMLIonxTestDialogMessageElement: {
        prototype: HTMLIonxTestDialogMessageElement;
        new (): HTMLIonxTestDialogMessageElement;
    };
    interface HTMLIonxTestExpandingSearchbarElement extends Components.IonxTestExpandingSearchbar, HTMLStencilElement {
    }
    var HTMLIonxTestExpandingSearchbarElement: {
        prototype: HTMLIonxTestExpandingSearchbarElement;
        new (): HTMLIonxTestExpandingSearchbarElement;
    };
    interface HTMLIonxTestHomeElement extends Components.IonxTestHome, HTMLStencilElement {
    }
    var HTMLIonxTestHomeElement: {
        prototype: HTMLIonxTestHomeElement;
        new (): HTMLIonxTestHomeElement;
    };
    interface HTMLIonxTestLoadingElement extends Components.IonxTestLoading, HTMLStencilElement {
    }
    var HTMLIonxTestLoadingElement: {
        prototype: HTMLIonxTestLoadingElement;
        new (): HTMLIonxTestLoadingElement;
    };
    interface HTMLIonxTestRootElement extends Components.IonxTestRoot, HTMLStencilElement {
    }
    var HTMLIonxTestRootElement: {
        prototype: HTMLIonxTestRootElement;
        new (): HTMLIonxTestRootElement;
    };
    interface HTMLIonxTestTagsInputElement extends Components.IonxTestTagsInput, HTMLStencilElement {
    }
    var HTMLIonxTestTagsInputElement: {
        prototype: HTMLIonxTestTagsInputElement;
        new (): HTMLIonxTestTagsInputElement;
    };
    interface HTMLIonxToggleLabelsElement extends Components.IonxToggleLabels, HTMLStencilElement {
    }
    var HTMLIonxToggleLabelsElement: {
        prototype: HTMLIonxToggleLabelsElement;
        new (): HTMLIonxToggleLabelsElement;
    };
    interface HTMLElementTagNameMap {
        "ion-router": HTMLIonRouterElement;
        "ionx-dialog": HTMLIonxDialogElement;
        "ionx-dialog-buttons": HTMLIonxDialogButtonsElement;
        "ionx-dialog-content": HTMLIonxDialogContentElement;
        "ionx-dialog-headers": HTMLIonxDialogHeadersElement;
        "ionx-dialog-message": HTMLIonxDialogMessageElement;
        "ionx-expanding-searchbar": HTMLIonxExpandingSearchbarElement;
        "ionx-expanding-searchbar-parent": HTMLIonxExpandingSearchbarParentElement;
        "ionx-form-item": HTMLIonxFormItemElement;
        "ionx-loading": HTMLIonxLoadingElement;
        "ionx-tags-input": HTMLIonxTagsInputElement;
        "ionx-test-dialog": HTMLIonxTestDialogElement;
        "ionx-test-dialog-content": HTMLIonxTestDialogContentElement;
        "ionx-test-dialog-message": HTMLIonxTestDialogMessageElement;
        "ionx-test-expanding-searchbar": HTMLIonxTestExpandingSearchbarElement;
        "ionx-test-home": HTMLIonxTestHomeElement;
        "ionx-test-loading": HTMLIonxTestLoadingElement;
        "ionx-test-root": HTMLIonxTestRootElement;
        "ionx-test-tags-input": HTMLIonxTestTagsInputElement;
        "ionx-toggle-labels": HTMLIonxToggleLabelsElement;
    }
}
declare namespace LocalJSX {
    interface IonRouter {
        /**
          * Emitted when the route had changed
         */
        "onIonRouteDidChange"?: (event: CustomEvent<RouterEventDetail>) => void;
        /**
          * Event emitted when the route is about to change
         */
        "onIonRouteWillChange"?: (event: CustomEvent<RouterEventDetail>) => void;
        /**
          * By default `ion-router` will match the routes at the root path ("/"). That can be changed when
         */
        "root"?: string;
        /**
          * The router can work in two "modes": - With hash: `/index.html#/path/to/page` - Without hash: `/path/to/page`  Using one or another might depend in the requirements of your app and/or where it"s deployed.  Usually "hash-less" navigation works better for SEO and it"s more user friendly too, but it might requires additional server-side configuration in order to properly work.  On the otherside hash-navigation is much easier to deploy, it even works over the file protocol.  By default, this property is `true`, change to `false` to allow hash-less URLs.
         */
        "useHash"?: boolean;
    }
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
        "message"?: string;
        /**
          * @inheritDoc
         */
        "messageComponent"?: string;
        /**
          * @inheritDoc
         */
        "messageComponentProps"?: {[prop: string]: any};
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
        "message": string;
    }
    interface IonxExpandingSearchbar {
        "expanded"?: boolean;
    }
    interface IonxExpandingSearchbarParent {
    }
    interface IonxFormItem {
        "error"?: string;
        /**
          * This attributes determines the background and border color of the form item. By default, items have a clear background and no border.
         */
        "fill"?: "clear" | "solid" | "outline";
        "hint"?: string;
    }
    interface IonxLoading {
        /**
          * If loading element should fill available space and center content both h and v.
         */
        "fill"?: boolean;
        "header"?: string;
        "message"?: string;
        "progressBuffer"?: number;
        "progressMessage"?: string;
        "progressPercent"?: number;
        "progressType"?: "determinate" | "indeterminate";
        "progressValue"?: number;
        /**
          * The type of loader.
          * @inheritDoc
         */
        "type"?: "spinner" | "progress";
    }
    interface IonxTagsInput {
        "canBackspaceRemove"?: boolean;
        "canEnterAdd"?: boolean;
        "hideRemove"?: boolean;
        "maxTags"?: number;
        "placeholder"?: string;
        "readonly"?: boolean;
        "separator"?: string;
        "sortFn"?: (a: string, b: string) => number;
        "sortable"?: boolean;
        "type"?: TextFieldTypes;
        "unique"?: boolean;
        "value"?: string[];
        "verifyFn"?: (tagSrt: string) => boolean;
    }
    interface IonxTestDialog {
    }
    interface IonxTestDialogContent {
    }
    interface IonxTestDialogMessage {
    }
    interface IonxTestExpandingSearchbar {
    }
    interface IonxTestHome {
    }
    interface IonxTestLoading {
    }
    interface IonxTestRoot {
    }
    interface IonxTestTagsInput {
    }
    interface IonxToggleLabels {
        "off"?: string;
        "on"?: string;
    }
    interface IntrinsicElements {
        "ion-router": IonRouter;
        "ionx-dialog": IonxDialog;
        "ionx-dialog-buttons": IonxDialogButtons;
        "ionx-dialog-content": IonxDialogContent;
        "ionx-dialog-headers": IonxDialogHeaders;
        "ionx-dialog-message": IonxDialogMessage;
        "ionx-expanding-searchbar": IonxExpandingSearchbar;
        "ionx-expanding-searchbar-parent": IonxExpandingSearchbarParent;
        "ionx-form-item": IonxFormItem;
        "ionx-loading": IonxLoading;
        "ionx-tags-input": IonxTagsInput;
        "ionx-test-dialog": IonxTestDialog;
        "ionx-test-dialog-content": IonxTestDialogContent;
        "ionx-test-dialog-message": IonxTestDialogMessage;
        "ionx-test-expanding-searchbar": IonxTestExpandingSearchbar;
        "ionx-test-home": IonxTestHome;
        "ionx-test-loading": IonxTestLoading;
        "ionx-test-root": IonxTestRoot;
        "ionx-test-tags-input": IonxTestTagsInput;
        "ionx-toggle-labels": IonxToggleLabels;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ion-router": LocalJSX.IonRouter & JSXBase.HTMLAttributes<HTMLIonRouterElement>;
            "ionx-dialog": LocalJSX.IonxDialog & JSXBase.HTMLAttributes<HTMLIonxDialogElement>;
            "ionx-dialog-buttons": LocalJSX.IonxDialogButtons & JSXBase.HTMLAttributes<HTMLIonxDialogButtonsElement>;
            "ionx-dialog-content": LocalJSX.IonxDialogContent & JSXBase.HTMLAttributes<HTMLIonxDialogContentElement>;
            "ionx-dialog-headers": LocalJSX.IonxDialogHeaders & JSXBase.HTMLAttributes<HTMLIonxDialogHeadersElement>;
            "ionx-dialog-message": LocalJSX.IonxDialogMessage & JSXBase.HTMLAttributes<HTMLIonxDialogMessageElement>;
            "ionx-expanding-searchbar": LocalJSX.IonxExpandingSearchbar & JSXBase.HTMLAttributes<HTMLIonxExpandingSearchbarElement>;
            "ionx-expanding-searchbar-parent": LocalJSX.IonxExpandingSearchbarParent & JSXBase.HTMLAttributes<HTMLIonxExpandingSearchbarParentElement>;
            "ionx-form-item": LocalJSX.IonxFormItem & JSXBase.HTMLAttributes<HTMLIonxFormItemElement>;
            "ionx-loading": LocalJSX.IonxLoading & JSXBase.HTMLAttributes<HTMLIonxLoadingElement>;
            "ionx-tags-input": LocalJSX.IonxTagsInput & JSXBase.HTMLAttributes<HTMLIonxTagsInputElement>;
            "ionx-test-dialog": LocalJSX.IonxTestDialog & JSXBase.HTMLAttributes<HTMLIonxTestDialogElement>;
            "ionx-test-dialog-content": LocalJSX.IonxTestDialogContent & JSXBase.HTMLAttributes<HTMLIonxTestDialogContentElement>;
            "ionx-test-dialog-message": LocalJSX.IonxTestDialogMessage & JSXBase.HTMLAttributes<HTMLIonxTestDialogMessageElement>;
            "ionx-test-expanding-searchbar": LocalJSX.IonxTestExpandingSearchbar & JSXBase.HTMLAttributes<HTMLIonxTestExpandingSearchbarElement>;
            "ionx-test-home": LocalJSX.IonxTestHome & JSXBase.HTMLAttributes<HTMLIonxTestHomeElement>;
            "ionx-test-loading": LocalJSX.IonxTestLoading & JSXBase.HTMLAttributes<HTMLIonxTestLoadingElement>;
            "ionx-test-root": LocalJSX.IonxTestRoot & JSXBase.HTMLAttributes<HTMLIonxTestRootElement>;
            "ionx-test-tags-input": LocalJSX.IonxTestTagsInput & JSXBase.HTMLAttributes<HTMLIonxTestTagsInputElement>;
            "ionx-toggle-labels": LocalJSX.IonxToggleLabels & JSXBase.HTMLAttributes<HTMLIonxToggleLabelsElement>;
        }
    }
}
