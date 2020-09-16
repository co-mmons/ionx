import {Component, ComponentInterface, h, Host, State} from "@stencil/core";
import {FormController, FormState, FormControlState} from "../../../components/forms";
import {required} from "../../../components/forms/validators";

@Component({
    tag: "ionx-test-form",
    scoped: true
})
export class FormTestPage implements ComponentInterface {

    form = new FormController({
        firstName: {value: null as string, validators: [required]},
        lastName: {value: null as number}
    }).bindStates(this);

    @State()
    formState: FormState;

    @State()
    test: number = 1;

    @State()
    firstName: FormControlState<string>;

    connectedCallback() {
        this.prepareForm();
    }

    disconnectedCallback() {
        this.form.disconnect();
    }

    prepareForm() {

        const states = this.form.states();

        for (const controlName of this.form.names()) {
            if (controlName === "firstName") {
                states[controlName].value = "ahaha";
            }
        }

        const names = this.form.names();
        names.includes("l");

        this.form.setStates(states);
    }

    render() {

        return <Host>
            <ion-content>
                <ion-button onClick={() => this.test++}>up</ion-button>
                <ion-button onClick={() => this.test--}>down</ion-button>

                <ionx-form-item error={this.firstName?.error}>

                    <ion-label position="stacked">No to jak?</ion-label>

                    <ion-input placeholder="Sdsdsd" ref={this.form.attach("firstName")}/>

                </ionx-form-item>

                <ion-button onClick={() => this.form.validate()}>validate</ion-button>

                <div>{this.firstName?.value}</div>

            </ion-content>
        </Host>;
    }
}
