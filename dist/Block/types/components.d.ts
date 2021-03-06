/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { BlockWidth } from "./BlockWidth";
import { BlockWidthsMap } from "./BlockWidthsMap";
export namespace Components {
    interface IonxBlock {
        "innerAlignment": "start" | "end" | "center";
        "innerStyle": {[key: string]: string};
        "innerWidth": BlockWidth | BlockWidthsMap;
        "margins": boolean;
        "padding": boolean;
    }
}
declare global {
    interface HTMLIonxBlockElement extends Components.IonxBlock, HTMLStencilElement {
    }
    var HTMLIonxBlockElement: {
        prototype: HTMLIonxBlockElement;
        new (): HTMLIonxBlockElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-block": HTMLIonxBlockElement;
    }
}
declare namespace LocalJSX {
    interface IonxBlock {
        "innerAlignment"?: "start" | "end" | "center";
        "innerStyle"?: {[key: string]: string};
        "innerWidth"?: BlockWidth | BlockWidthsMap;
        "margins"?: boolean;
        "padding"?: boolean;
    }
    interface IntrinsicElements {
        "ionx-block": IonxBlock;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-block": LocalJSX.IonxBlock & JSXBase.HTMLAttributes<HTMLIonxBlockElement>;
        }
    }
}
