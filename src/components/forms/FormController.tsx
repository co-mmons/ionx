import {Component, ComponentInterface, h, Host, Prop} from "@stencil/core";
import {FormControllerImpl} from "./FormControllerImpl";

@Component({
    tag: "ionx-form-controller"
})
export class FormController implements ComponentInterface {

    @Prop()
    controller!: FormControllerImpl;

    /**
     * If controller should be disconnected when component is disconnected from the DOM.
     * By default is true, but you can set to false when you expect that form controller component
     * can be connected/disconnected to DOM multiple times (e.g. when conditional rendering takes place).
     */
    @Prop()
    disconnect?: boolean = true;

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
