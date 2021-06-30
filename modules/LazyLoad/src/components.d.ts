/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface IonxLazyLoad {
        "container"?: "parent" | "self" | "content";
        "observeShadow"?: boolean;
    }
}
declare global {
    interface HTMLIonxLazyLoadElement extends Components.IonxLazyLoad, HTMLStencilElement {
    }
    var HTMLIonxLazyLoadElement: {
        prototype: HTMLIonxLazyLoadElement;
        new (): HTMLIonxLazyLoadElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-lazy-load": HTMLIonxLazyLoadElement;
    }
}
declare namespace LocalJSX {
    interface IonxLazyLoad {
        "container"?: "parent" | "self" | "content";
        "observeShadow"?: boolean;
    }
    interface IntrinsicElements {
        "ionx-lazy-load": IonxLazyLoad;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-lazy-load": LocalJSX.IonxLazyLoad & JSXBase.HTMLAttributes<HTMLIonxLazyLoadElement>;
        }
    }
}
