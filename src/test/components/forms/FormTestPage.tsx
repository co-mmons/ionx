import {Component, ComponentInterface, h, Host, State} from "@stencil/core";
import {Form} from "../../../components/form/Form";

@Component({
    tag: "ionx-test-form",
    scoped: true
})
export class FormTestPage implements ComponentInterface {

    form: Form;

    @State()
    test: number = 1;

    connectedCallback() {
        this.prepareForm();
    }

    disconnectedCallback() {
        this.form?.destroy();
    }

    prepareForm() {

        if (!this.form || this.form.isDestroyed()) {
            this.form = new Form(["firstName"], {owner: this});
        }

        for (const control of this.form.controlList()) {
            if (control.name === "firstName") {
            }
        }
    }

    render() {
        return <Host>
            <ion-content>
                <ion-button onClick={() => this.test++}>up</ion-button>
                <ion-button onClick={() => this.test--}>down</ion-button>
                <ion-input placeholder="Sdsdsd" ref={this.form.bind("firstName")}/>
            </ion-content>
        </Host>;
    }
}
