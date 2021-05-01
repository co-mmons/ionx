/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { TooltipErrorPresenter } from "./TooltipErrorPresenter";
import { TooltipErrorPresenterOptions } from "./TooltipErrorPresenterOptions";
export namespace Components {
    interface IonxFormTooltipErrorPresenter {
        "instance"?: TooltipErrorPresenter | false;
        "options"?: TooltipErrorPresenterOptions;
    }
}
declare global {
    interface HTMLIonxFormTooltipErrorPresenterElement extends Components.IonxFormTooltipErrorPresenter, HTMLStencilElement {
    }
    var HTMLIonxFormTooltipErrorPresenterElement: {
        prototype: HTMLIonxFormTooltipErrorPresenterElement;
        new (): HTMLIonxFormTooltipErrorPresenterElement;
    };
    interface HTMLElementTagNameMap {
        "ionx-form-tooltip-error-presenter": HTMLIonxFormTooltipErrorPresenterElement;
    }
}
declare namespace LocalJSX {
    interface IonxFormTooltipErrorPresenter {
        "instance"?: TooltipErrorPresenter | false;
        "options"?: TooltipErrorPresenterOptions;
    }
    interface IntrinsicElements {
        "ionx-form-tooltip-error-presenter": IonxFormTooltipErrorPresenter;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ionx-form-tooltip-error-presenter": LocalJSX.IonxFormTooltipErrorPresenter & JSXBase.HTMLAttributes<HTMLIonxFormTooltipErrorPresenterElement>;
        }
    }
}