import {Component, ComponentInterface, h, Host, Method, Prop} from "@stencil/core";
import {FormControlAttachOptions} from "./FormControlAttachOptions";
import {FormController} from "./FormController";
import {FormControllerPublicApi, FormControllerValidateOptions} from "./FormControllerPublicApi";
import {loadIntlMessages} from "./intl/loadIntlMessages";

@Component({
    tag: "ionx-form-controller"
})
export class FormControllerComponent implements ComponentInterface, FormControllerPublicApi {

    @Prop()
    controller!: FormController;

    /**
     * If controller should be disconnected when component is disconnected from the DOM.
     * By default is true, but you can set to false when you expect that form controller component
     * can be connected/disconnected to DOM multiple times (e.g. when conditional rendering takes place).
     */
    @Prop()
    disconnect?: boolean = true;

    @Method()
    async attach(name: string, options?: FormControlAttachOptions) {
        this.controller.attach(name, options);
    }

    @Method()
    validate(options?: FormControllerValidateOptions) {
        return this.controller.validate(options);
    }

    async componentWillLoad() {
        await loadIntlMessages();
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
