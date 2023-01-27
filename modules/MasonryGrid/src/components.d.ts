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
        "innerStyle": any;
        "markItemAsDirty": (item: HTMLElement) => Promise<void>;
    }
    interface IonxTest {
    }
}
declare global {
    interface HTMLIonxMasonryGridElement extends Components.IonxMasonryGrid, HTMLStencilElement {
    }
    var HTMLIonxMasonryGridElement: {
        prototype: HTMLIonxMasonryGridElement;
        new (): HTMLIonxMasonryGridElement;
    };
    interface HTMLIonxTestElement extends Components.IonxTest, HTMLStencilElement {
    }
    var HTMLIonxTestElement: {
        prototype: HTMLIonxTestElement;
        new (): HTMLIonxTestElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-masonry-grid": HTMLIonxMasonryGridElement;
        "ionx-test": HTMLIonxTestElement;
    }
}
declare namespace LocalJSX {
    interface IonxMasonryGrid {
        "innerStyle"?: any;
    }
    interface IonxTest {
    }
    interface IntrinsicElements {
        "ionx-masonry-grid": IonxMasonryGrid;
        "ionx-test": IonxTest;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-masonry-grid": LocalJSX.IonxMasonryGrid & JSXBase.HTMLAttributes<HTMLIonxMasonryGridElement>;
            "ionx-test": LocalJSX.IonxTest & JSXBase.HTMLAttributes<HTMLIonxTestElement>;
        }
    }
}
