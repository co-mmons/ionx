/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface IonxToggleLabels {
        /**
          * If default toggle should be created instead of user-defined.
         */
        "defaultToggle": boolean;
        "disabled": boolean;
        "off": string;
        "on": string;
        "prefetch": boolean;
        "readonly": boolean;
        "value": boolean;
    }
}
declare global {
    interface HTMLIonxToggleLabelsElement extends Components.IonxToggleLabels, HTMLStencilElement {
    }
    var HTMLIonxToggleLabelsElement: {
        prototype: HTMLIonxToggleLabelsElement;
        new (): HTMLIonxToggleLabelsElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-toggle-labels": HTMLIonxToggleLabelsElement;
    }
}
declare namespace LocalJSX {
    interface IonxToggleLabels {
        /**
          * If default toggle should be created instead of user-defined.
         */
        "defaultToggle"?: boolean;
        "disabled"?: boolean;
        "off"?: string;
        "on"?: string;
        "onIonChange"?: (event: CustomEvent<{value: boolean}>) => void;
        "prefetch"?: boolean;
        "readonly"?: boolean;
        "value"?: boolean;
    }
    interface IntrinsicElements {
        "ionx-toggle-labels": IonxToggleLabels;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-toggle-labels": LocalJSX.IonxToggleLabels & JSXBase.HTMLAttributes<HTMLIonxToggleLabelsElement>;
        }
    }
}
