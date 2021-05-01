/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ExtendedItemElement } from "./ExtendedItemElement";
export namespace Components {
    interface IonxMasonryGrid {
        "arrange": (options?: { force?: boolean; trigger?: "onresize"; }) => Promise<void>;
        "block": boolean;
        "markItemAsDirty": (item: HTMLElement) => Promise<void>;
    }
}
declare global {
    interface HTMLIonxMasonryGridElement extends Components.IonxMasonryGrid, HTMLStencilElement {
    }
    var HTMLIonxMasonryGridElement: {
        prototype: HTMLIonxMasonryGridElement;
        new (): HTMLIonxMasonryGridElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-masonry-grid": HTMLIonxMasonryGridElement;
    }
}
declare namespace LocalJSX {
    interface IonxMasonryGrid {
        "block"?: boolean;
    }
    interface IntrinsicElements {
        "ionx-masonry-grid": IonxMasonryGrid;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-masonry-grid": LocalJSX.IonxMasonryGrid & JSXBase.HTMLAttributes<HTMLIonxMasonryGridElement>;
        }
    }
}