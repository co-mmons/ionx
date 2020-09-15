import {Component, ComponentInterface, h, Host, State} from "@stencil/core";
import {FormController, FormState} from "../../../components/form";
import {required} from "../../../components/form/validators";

@Component({
    tag: "ionx-test-form",
    scoped: true
})
export class FormTestPage implements ComponentInterface {

    form: FormController;

    @State()
    formState: FormState;

    @State()
    test: number = 1;

    connectedCallback() {
        this.prepareForm();
    }

    prepareForm() {

        if (!this.form || this.form.isDestroyed()) {
            this.form = new FormController(["firstName"], {owner: this});

            this.form.onStateChange(state => this.formState = state);
        }

        const states = this.form.controlMutableStates();

        for (const controlName of this.form.controlNames()) {
            if (controlName === "firstName") {
                states[controlName].value = "ahaha";
            }
        }

        this.form.setStates(states);
    }

    render() {
        console.log('render', this.formState.controls.firstName.value);
        return <Host>
            <ion-content>
                <ion-button onClick={() => this.test++}>up</ion-button>
                <ion-button onClick={() => this.test--}>down</ion-button>
                <ionx-form controller={this.form}>

                    <ionx-form-item error={this.formState.controls.firstName.error}>

                        <ion-label position="stacked">No to jak?</ion-label>

                        <ion-input placeholder="Sdsdsd" ref={this.form.bind("firstName", {validators: required})}/>

                    </ionx-form-item>

                </ionx-form>

                <ion-button onClick={() => this.form.validate()}>validate</ion-button>

                <div>{this.formState.controls.firstName.value}</div>

            </ion-content>
        </Host>;
    }
}
