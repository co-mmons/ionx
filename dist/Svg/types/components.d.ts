/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface IonxSvg {
        "source": string | ArrayBuffer;
        "src": string;
    }
}
declare global {
    interface HTMLIonxSvgElement extends Components.IonxSvg, HTMLStencilElement {
    }
    var HTMLIonxSvgElement: {
        prototype: HTMLIonxSvgElement;
        new (): HTMLIonxSvgElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-svg": HTMLIonxSvgElement;
    }
}
declare namespace LocalJSX {
    interface IonxSvg {
        "source"?: string | ArrayBuffer;
        "src"?: string;
    }
    interface IntrinsicElements {
        "ionx-svg": IonxSvg;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-svg": LocalJSX.IonxSvg & JSXBase.HTMLAttributes<HTMLIonxSvgElement>;
        }
    }
}
