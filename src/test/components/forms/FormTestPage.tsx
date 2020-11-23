import {intl, pushMessages} from "@co.mmons/js-intl";
import {Component, ComponentInterface, h, Host, State} from "@stencil/core";
import {FormController, FormControlState, FormState} from "../../../components/forms";
import {minLength, required} from "../../../components/forms/validators";

@Component({
    tag: "ionx-test-form",
    scoped: true
})
export class FormTestPage implements ComponentInterface {

    form = new FormController({
        firstName: {value: null as string, validators: [minLength(3)]},
        lastName: {value: null as number}
    });

    @State()
    formState: FormState;

    @State()
    test: number = 1;

    @State()
    firstName: FormControlState<string>;

    connectedCallback() {

        import(`../../../components/forms/intl/pl.json`).then(messages => pushMessages(intl.locale, "ionx/forms", messages.default));

        this.form
            .bindStates(this)
            .onStateChange(state => this.formState = state.current);

        this.prepareData();
    }

    disconnectedCallback() {
        this.form.disconnect();
    }

    prepareData() {

        const states = this.form.states();

        for (const controlName of this.form.names()) {
            if (controlName === "firstName") {
            }
        }

        this.form.setStates(states);
    }

    render() {

        return <Host>
            <ion-content>
                <ion-button onClick={() => this.test++}>up</ion-button>
                <ion-button onClick={() => this.test--}>down</ion-button>

                <ionx-form-controller controller={this.form} disconnect={false}>

                    <ionx-form-tooltip-error-presenter/>

                    <ion-grid>

                        <ion-row>

                            <ion-col size-xs="12">
                                <ionx-form-item>

                                    <ion-label position="stacked">First name</ion-label>

                                    <ion-input ref={this.form.attach("firstName")}/>

                                </ionx-form-item>
                            </ion-col>

                            <ion-col size-xs="12">
                                <ionx-form-item error={this.formState?.controls.lastName?.error}>

                                    <ion-label position="stacked">Last name</ion-label>

                                    <ion-input ref={this.form.attach("lastName")}/>

                                </ionx-form-item>
                            </ion-col>

                            <ion-col size-xs="12">

                                <ionx-form-item error={this.formState?.controls.placeOfBirth?.error}>

                                    <ion-label position="stacked">Place of birth {this.formState?.controls.placeOfBirth?.value}</ion-label>

                                    <ion-input ref={this.form.attach("placeOfBirth", {validators: [required]})}/>

                                </ionx-form-item>

                            </ion-col>

                            <ion-col size-xs="12">
                                <ion-button onClick={() => this.form.validate()}>validate</ion-button>
                            </ion-col>

                        </ion-row>

                    </ion-grid>

                </ionx-form-controller>

            </ion-content>
        </Host>;
    }
}
