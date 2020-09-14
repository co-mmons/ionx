import {Component, ComponentInterface, h, Host, State} from "@stencil/core";
import {FormController} from "../../../components/form";
import {required} from "../../../components/form/validators";

@Component({
    tag: "ionx-test-form",
    scoped: true
})
export class FormTestPage implements ComponentInterface {

    form: FormController;

    @State()
    test: number = 1;

    connectedCallback() {
        this.prepareForm();
    }

    prepareForm() {

        if (!this.form || this.form.isDestroyed()) {
            this.form = new FormController(["firstName"], {owner: this});
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
                <ionx-form controller={this.form}>
                    <ion-item>
                        <ion-input placeholder="Sdsdsd" ref={this.form.bind("firstName", {validators: required})}/>
                    </ion-item>
                </ionx-form>

                <ion-button onClick={() => this.form.validate()}>validate</ion-button>
            </ion-content>
        </Host>;
    }
}
