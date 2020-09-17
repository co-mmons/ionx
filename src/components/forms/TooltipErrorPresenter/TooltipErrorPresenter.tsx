import {Component, ComponentInterface, Element, Prop} from "@stencil/core";
import {TooltipErrorPresenterImpl} from "./TooltipErrorPresenterImpl";
import {TooltipErrorPresenterOptions} from "./TooltipErrorPresenterOptions";

@Component({
    tag: "ionx-form-tooltip-error-presenter",
    styleUrl: "TooltipErrorPresenter.scss",
    shadow: false,
    scoped: false
})
export class TooltipErrorPresenter implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    instance?: TooltipErrorPresenterImpl | false;

    private instance$: TooltipErrorPresenterImpl;

    @Prop()
    options?: TooltipErrorPresenterOptions;

    connectedCallback() {

        if (!this.instance$ && this.instance !== false) {
            this.instance$ = this.instance ? this.instance : new TooltipErrorPresenterImpl();
        }

        if (this.instance$) {
            const form = this.element.closest<HTMLIonxFormElement>("ionx-form");
            if (form?.controller) {
                form.controller.errorPresenter = this.instance$;
            }
        }
    }

    disconnectedCallback() {
    }

}
