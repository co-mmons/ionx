import {intl, pushMessages} from "@co.mmons/js-intl";
import {Component, ComponentInterface, h, Host, State} from "@stencil/core";
import {FormController, FormControlState, FormFieldLabelButton, formGrid, FormState} from "../../../components/forms";
import {minLength, required} from "../../../components/forms/validators";

@Component({
    tag: "ionx-test-form",
    scoped: true
})
export class FormTestPage implements ComponentInterface {

    form = new FormController({
        text1: {value: null as string, validators: [required]},
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

                    {/*<ionx-form-tooltip-error-presenter/>*/}

                    <ion-grid ref={formGrid}>

                        <ion-row>

                            <ion-col size-xs="12">
                                <ionx-form-field>

                                    <span slot="label">Form field with nested fields</span>

                                    <ion-grid>
                                        <ion-row>
                                            <ion-col size-md={6}>
                                                <ionx-form-field label="Text input" error={this.form.controls.text1.error}>
                                                    <div slot="description">A to jest podpowiedź!</div>
                                                    <ion-input placeholder="sjdjsd" ref={this.form.attach("text1")}/>
                                                </ionx-form-field>
                                            </ion-col>
                                            <ion-col size-md={6}>
                                                <ionx-form-field label="Toogle">
                                                    <ionx-toggle-labels on="Yes" off="No">
                                                        <ion-toggle ref={this.form.attach("toggle1")}/>
                                                    </ionx-toggle-labels>
                                                </ionx-form-field>
                                            </ion-col>
                                            <ion-col size-xs={6}>
                                                <ionx-form-field label="Checkbox">
                                                    <ion-textarea autoGrow/>
                                                </ionx-form-field>
                                            </ion-col>
                                            <ion-col size-xs={6}>
                                                <ionx-form-field label="Select">
                                                    <FormFieldLabelButton>
                                                        <ion-icon name="list" slot="start"/>
                                                        <span>Wybierz</span>
                                                    </FormFieldLabelButton>

                                                    <FormFieldLabelButton color="danger">
                                                        <ion-icon name="trash" slot="start"/>
                                                        <span>Usuń</span>
                                                    </FormFieldLabelButton>

                                                    <FormFieldLabelButton>
                                                        <ion-icon name="help-circle" slot="icon-only"/>
                                                    </FormFieldLabelButton>

                                                    <FormFieldLabelButton>
                                                        <ion-icon name="ellipsis-vertical" slot="icon-only"/>
                                                    </FormFieldLabelButton>

                                                    <ionx-select orderable={true} options={[{value: 1, label: "1"}]}/>
                                                    <ion-button fill="clear" size="small" slot="end">
                                                        <ion-icon name="close" slot="icon-only"/>
                                                    </ion-button>
                                                </ionx-form-field>
                                            </ion-col>
                                            <ion-col size-xs={6}>
                                                <ionx-form-field label="List">
                                                    <ion-list lines="full">
                                                        {[1,2,3].map(v => <ion-item button>
                                                            <ion-label>{v}</ion-label>
                                                        </ion-item>)}
                                                    </ion-list>
                                                </ionx-form-field>
                                            </ion-col>
                                        </ion-row>
                                    </ion-grid>

                                </ionx-form-field>
                            </ion-col>

                            <ion-col size-xs="12">
                                <ionx-form-field>

                                    <span slot="label">First name</span>

                                    <ion-input ref={this.form.attach("firstName")}/>

                                </ionx-form-field>
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
