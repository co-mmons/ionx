import {Component, ComponentInterface, h, Host, Prop} from "@stencil/core";
import {FormController} from "./FormController";

@Component({
    tag: "ionx-form"
})
export class Form implements ComponentInterface {

    @Prop()
    controller!: FormController<any>;

    render() {
        return <Host>
            <slot/>
        </Host>;
    }

}
