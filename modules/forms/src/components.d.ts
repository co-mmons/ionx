/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { FormController } from "./FormController";
import { FormStateChange } from "./FormStateChange";
import { FormControlAttachOptions } from "./FormControlAttachOptions";
import { FormControllerValidateOptions } from "./FormControllerPublicApi";
import { FormControlState } from "./FormControlState";
import { FormValidationError } from "./FormValidationError";
import { MessageRef } from "@co.mmons/js-intl";
export namespace Components {
    interface IonxForm {
        "attach": (name: string, options?: FormControlAttachOptions) => Promise<void>;
        "controller": FormController;
        /**
          * If controller should be disconnected when component is disconnected from the DOM. By default is true, but you can set to false when you expect that form controller component can be connected/disconnected to DOM multiple times (e.g. when conditional rendering takes place).
         */
        "disconnect"?: boolean;
        "validate": (options?: FormControllerValidateOptions) => Promise<boolean>;
    }
    interface IonxFormField {
        "collapsible"?: boolean;
        "control"?: FormControlState;
        "error"?: string | FormValidationError | MessageRef | Error;
        "expanded"?: boolean;
        "flexContent"?: boolean;
        "hasLabel": boolean;
        "label"?: string;
        "setExpanded": (expanded: boolean) => Promise<void>;
        "toggleExpanded": () => Promise<void>;
    }
    interface IonxFormItem {
        "control"?: FormControlState;
        "error"?: string | FormValidationError | MessageRef | Error;
        /**
          * This attributes determines the background and border color of the form item. By default, items have a clear background and no border.
         */
        "fill": "clear" | "solid" | "outline";
        "hint": string;
        "itemProps": Partial<import("@stencil/core/internal").JSXBase.HTMLAttributes> & Partial<import("@ionic/core/components").Components.IonItem>;
        "itemStyle"?: {[key: string]: string};
        /**
          * @deprecated
         */
        "partProps": {
        item?: Partial<import("@stencil/core/internal").JSXBase.HTMLAttributes> & Partial<import("@ionic/core/components").Components.IonItem>
    };
    }
}
declare global {
    interface HTMLIonxFormElement extends Components.IonxForm, HTMLStencilElement {
    }
    var HTMLIonxFormElement: {
        prototype: HTMLIonxFormElement;
        new (): HTMLIonxFormElement;
    };
    interface HTMLIonxFormFieldElement extends Components.IonxFormField, HTMLStencilElement {
    }
    var HTMLIonxFormFieldElement: {
        prototype: HTMLIonxFormFieldElement;
        new (): HTMLIonxFormFieldElement;
    };
    interface HTMLIonxFormItemElement extends Components.IonxFormItem, HTMLStencilElement {
    }
    var HTMLIonxFormItemElement: {
        prototype: HTMLIonxFormItemElement;
        new (): HTMLIonxFormItemElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-form": HTMLIonxFormElement;
        "ionx-form-field": HTMLIonxFormFieldElement;
        "ionx-form-item": HTMLIonxFormItemElement;
    }
}
declare namespace LocalJSX {
    interface IonxForm {
        "controller": FormController;
        /**
          * If controller should be disconnected when component is disconnected from the DOM. By default is true, but you can set to false when you expect that form controller component can be connected/disconnected to DOM multiple times (e.g. when conditional rendering takes place).
         */
        "disconnect"?: boolean;
        "onStateChange"?: (event: CustomEvent<FormStateChange>) => void;
    }
    interface IonxFormField {
        "collapsible"?: boolean;
        "control"?: FormControlState;
        "error"?: string | FormValidationError | MessageRef | Error;
        "expanded"?: boolean;
        "flexContent"?: boolean;
        "hasLabel"?: boolean;
        "label"?: string;
        "onExpandCollapse"?: (event: CustomEvent<boolean>) => void;
    }
    interface IonxFormItem {
        "control"?: FormControlState;
        "error"?: string | FormValidationError | MessageRef | Error;
        /**
          * This attributes determines the background and border color of the form item. By default, items have a clear background and no border.
         */
        "fill"?: "clear" | "solid" | "outline";
        "hint"?: string;
        "itemProps"?: Partial<import("@stencil/core/internal").JSXBase.HTMLAttributes> & Partial<import("@ionic/core/components").Components.IonItem>;
        "itemStyle"?: {[key: string]: string};
        /**
          * @deprecated
         */
        "partProps"?: {
        item?: Partial<import("@stencil/core/internal").JSXBase.HTMLAttributes> & Partial<import("@ionic/core/components").Components.IonItem>
    };
    }
    interface IntrinsicElements {
        "ionx-form": IonxForm;
        "ionx-form-field": IonxFormField;
        "ionx-form-item": IonxFormItem;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-form": LocalJSX.IonxForm & JSXBase.HTMLAttributes<HTMLIonxFormElement>;
            "ionx-form-field": LocalJSX.IonxFormField & JSXBase.HTMLAttributes<HTMLIonxFormFieldElement>;
            "ionx-form-item": LocalJSX.IonxFormItem & JSXBase.HTMLAttributes<HTMLIonxFormItemElement>;
        }
    }
}
