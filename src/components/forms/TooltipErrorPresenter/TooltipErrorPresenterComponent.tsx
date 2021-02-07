import {Component, ComponentInterface, Element, Prop} from "@stencil/core";
import {TooltipErrorPresenter} from "./TooltipErrorPresenter";
import {TooltipErrorPresenterOptions} from "./TooltipErrorPresenterOptions";

@Component({
    tag: "ionx-form-tooltip-error-presenter",
    styleUrl: "TooltipErrorPresenter.scss",
    shadow: false,
    scoped: false
})
export class TooltipErrorPresenterComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    instance?: TooltipErrorPresenter | false;

    private instance$: TooltipErrorPresenter;

    @Prop()
    options?: TooltipErrorPresenterOptions;

    connectedCallback() {

        if (!this.instance$ && this.instance !== false) {
            this.instance$ = this.instance ? this.instance : new TooltipErrorPresenter();
        }

        if (this.instance$) {
            const form = this.element.closest<HTMLIonxFormControllerElement>("ionx-form-controller");
            if (form?.controller) {
                form.controller.errorPresenter = this.instance$;
            }
        }
    }

    disconnectedCallback() {
    }

}
