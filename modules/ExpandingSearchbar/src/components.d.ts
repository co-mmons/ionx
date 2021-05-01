/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface IonxExpandingSearchbar {
        "expand": () => Promise<void>;
        "expanded": boolean;
    }
    interface IonxExpandingSearchbarParent {
    }
}
declare global {
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
    interface HTMLElementTagNameMap {
        "ionx-expanding-searchbar": HTMLIonxExpandingSearchbarElement;
        "ionx-expanding-searchbar-parent": HTMLIonxExpandingSearchbarParentElement;
    }
}
declare namespace LocalJSX {
    interface IonxExpandingSearchbar {
        "expanded"?: boolean;
    }
    interface IonxExpandingSearchbarParent {
    }
    interface IntrinsicElements {
        "ionx-expanding-searchbar": IonxExpandingSearchbar;
        "ionx-expanding-searchbar-parent": IonxExpandingSearchbarParent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-expanding-searchbar": LocalJSX.IonxExpandingSearchbar & JSXBase.HTMLAttributes<HTMLIonxExpandingSearchbarElement>;
            "ionx-expanding-searchbar-parent": LocalJSX.IonxExpandingSearchbarParent & JSXBase.HTMLAttributes<HTMLIonxExpandingSearchbarParentElement>;
        }
    }
}