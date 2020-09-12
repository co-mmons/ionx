import {Component, ComponentInterface, h} from "@stencil/core";
import {Form} from "./Form";

@Component({
    tag: "tttt-ttetst"
})
export class FormTest implements ComponentInterface {

    form: Form;

    componentDidLoad() {
        this.prepareForm();
    }

    prepareForm() {

        if (!this.form) {
            this.form = new Form(["firstName"], {component: this});
        }

        for (const control of this.form.controlList()) {
            if (control.name === "firstName") {
                control
            }
        }
    }

    render() {
        return <div>
            <ion-input ref={this.form.bind("firstName")}/>

            {this.form.state.controls.firstName.value && <div>yououou</div>};
        </div>;
    }
}
