/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { TextFieldTypes } from "@ionic/core/components";
export namespace Components {
    interface IonxTagsInput {
        "canBackspaceRemove": boolean;
        "canEnterAdd": boolean;
        "hideRemove": boolean;
        "maxTags": number;
        "placeholder": string;
        "readonly": boolean;
        "required"?: boolean;
        "separator": string;
        "setFocus": () => Promise<void>;
        "sortFn": (a: string, b: string) => number;
        "sortable": boolean;
        "type": TextFieldTypes;
        "unique": boolean;
        "value": string[];
        "verifyFn": (tagSrt: string) => boolean;
    }
}
declare global {
    interface HTMLIonxTagsInputElement extends Components.IonxTagsInput, HTMLStencilElement {
    }
    var HTMLIonxTagsInputElement: {
        prototype: HTMLIonxTagsInputElement;
        new (): HTMLIonxTagsInputElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-tags-input": HTMLIonxTagsInputElement;
    }
}
declare namespace LocalJSX {
    interface IonxTagsInput {
        "canBackspaceRemove"?: boolean;
        "canEnterAdd"?: boolean;
        "hideRemove"?: boolean;
        "maxTags"?: number;
        "onIonChange"?: (event: CustomEvent<{value: string[]}>) => void;
        "placeholder"?: string;
        "readonly"?: boolean;
        "required"?: boolean;
        "separator"?: string;
        "sortFn"?: (a: string, b: string) => number;
        "sortable"?: boolean;
        "type"?: TextFieldTypes;
        "unique"?: boolean;
        "value"?: string[];
        "verifyFn"?: (tagSrt: string) => boolean;
    }
    interface IntrinsicElements {
        "ionx-tags-input": IonxTagsInput;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-tags-input": LocalJSX.IonxTagsInput & JSXBase.HTMLAttributes<HTMLIonxTagsInputElement>;
        }
    }
}
