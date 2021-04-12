/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { TimeZoneDate } from "@co.mmons/js-utils/core";
import { StyleEventDetail } from "@ionic/core";
export namespace Components {
    interface IonxDateTime {
        "clearButtonIcon": string;
        "clearButtonText": string;
        "clearButtonVisible": boolean;
        "dateOnly": boolean;
        /**
          * Timezone, that will be set, when new value is picked from picker.
         */
        "defaultTimeZone": string;
        "disabled": boolean;
        "formatOptions": Intl.DateTimeFormatOptions;
        "open": (event?: any) => Promise<void>;
        "readonly": boolean;
        "setBlur": () => Promise<void>;
        "setFocus": (options?: FocusOptions) => Promise<void>;
        /**
          * Whether timezone cannot be changed.
         */
        "timeZoneDisabled": boolean;
        "value": TimeZoneDate;
        "w": any;
    }
    interface IonxDateTimeOverlay {
        "dateOnly": boolean;
        "timeZoneDisabled": boolean;
        "value": TimeZoneDate;
    }
}
declare global {
    interface HTMLIonxDateTimeElement extends Components.IonxDateTime, HTMLStencilElement {
    }
    var HTMLIonxDateTimeElement: {
        prototype: HTMLIonxDateTimeElement;
        new (): HTMLIonxDateTimeElement;
    };
    interface HTMLIonxDateTimeOverlayElement extends Components.IonxDateTimeOverlay, HTMLStencilElement {
    }
    var HTMLIonxDateTimeOverlayElement: {
        prototype: HTMLIonxDateTimeOverlayElement;
        new (): HTMLIonxDateTimeOverlayElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-date-time": HTMLIonxDateTimeElement;
        "ionx-date-time-overlay": HTMLIonxDateTimeOverlayElement;
    }
}
declare namespace LocalJSX {
    interface IonxDateTime {
        "clearButtonIcon"?: string;
        "clearButtonText"?: string;
        "clearButtonVisible"?: boolean;
        "dateOnly"?: boolean;
        /**
          * Timezone, that will be set, when new value is picked from picker.
         */
        "defaultTimeZone"?: string;
        "disabled"?: boolean;
        "formatOptions"?: Intl.DateTimeFormatOptions;
        "onIonChange"?: (event: CustomEvent<any>) => void;
        "onIonFocus"?: (event: CustomEvent<any>) => void;
        /**
          * Emitted when the styles change.
         */
        "onIonStyle"?: (event: CustomEvent<StyleEventDetail>) => void;
        "readonly"?: boolean;
        /**
          * Whether timezone cannot be changed.
         */
        "timeZoneDisabled"?: boolean;
        "value"?: TimeZoneDate;
        "w"?: any;
    }
    interface IonxDateTimeOverlay {
        "dateOnly"?: boolean;
        "timeZoneDisabled"?: boolean;
        "value"?: TimeZoneDate;
    }
    interface IntrinsicElements {
        "ionx-date-time": IonxDateTime;
        "ionx-date-time-overlay": IonxDateTimeOverlay;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-date-time": LocalJSX.IonxDateTime & JSXBase.HTMLAttributes<HTMLIonxDateTimeElement>;
            "ionx-date-time-overlay": LocalJSX.IonxDateTimeOverlay & JSXBase.HTMLAttributes<HTMLIonxDateTimeOverlayElement>;
        }
    }
}