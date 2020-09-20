import {Component, ComponentInterface, h, Host, Method, Prop} from "@stencil/core";
import {FormControlAttachOptions} from "./FormControlAttachOptions";
import {FormControllerImpl} from "./FormControllerImpl";
import {FormControllerPublicApi, FormControllerValidateOptions} from "./FormControllerPublicApi";

@Component({
    tag: "ionx-form-controller"
})
export class FormController implements ComponentInterface, FormControllerPublicApi {

    @Prop()
    controller!: FormControllerImpl;

    /**
     * If controller should be disconnected when component is disconnected from the DOM.
     * By default is true, but you can set to false when you expect that form controller component
     * can be connected/disconnected to DOM multiple times (e.g. when conditional rendering takes place).
     */
    @Prop()
    disconnect?: boolean = true;

    @Method()
    async attach(element: HTMLElement, name: string, options?: FormControlAttachOptions) {
        this.controller.attach(element, name, options);
    }

    @Method()
    validate(options?: FormControllerValidateOptions) {
        return this.controller.validate(options);
    }

    render() {
        return <Host>
            <slot/>
        </Host>;
    }

    disconnectedCallback() {
        if (this.disconnect) {
            this.controller.disconnect();
        }
    }

}
