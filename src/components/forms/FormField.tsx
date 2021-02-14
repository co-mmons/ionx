import {intl, MessageRef} from "@co.mmons/js-intl";
import {Component, h, Host, Prop, State, Watch} from "@stencil/core";
import {FormControlState} from "./FormControlState";
import {FormValidationError} from "./FormValidationError";

@Component({
    tag: "ionx-form-field",
    scoped: true,
    styleUrl: "FormField.scss"
})
export class FormField {

    @Prop()
    label?: string;

    @Prop()
    control?: FormControlState;

    @Prop()
    error?: string | FormValidationError | MessageRef | Error;

    @State()
    errorMessage: string;

    @Watch("control")
    @Watch("error")
    watchErrorProps() {
        this.buildErrorMessage();
    }

    private buildErrorMessage() {

        if (typeof this.error === "string") {
            this.errorMessage = this.error;
        } else if (this.error instanceof FormValidationError) {
            this.errorMessage = this.error.message;
        } else if (this.error instanceof MessageRef) {
            this.errorMessage = intl.message(this.error);
        } else if (this.error instanceof Error) {
            this.errorMessage = `${this.error.message}`;
        } else if (this.error) {
            this.errorMessage = intl.message`ionx/forms#validators/InvalidValueError`;
        } else if (this.control?.error) {
            this.errorMessage = this.control.error.message;
        } else {
            this.errorMessage = undefined;
        }
    }

    render() {

        return <Host>
            <fieldset>

                <legend>
                    <div slot-container="label">
                        <slot name="label">{this.label}</slot>
                    </div>
                    <div slot-container="label-end">
                        <slot name="label-end"/>
                    </div>
                </legend>

                <div slot-container="description">
                    <slot name="description"/>
                </div>

                <div slot-container="placeholder">
                    <slot name="placeholder"/>
                </div>

                <div ionx--content>
                    <div slot-container="default">
                        <slot/>
                    </div>

                    <div slot-container="end">
                        <slot name="end"/>
                    </div>
                </div>

            </fieldset>

            <div slot-container="error">
                {this.errorMessage && <span slot="error">{this.errorMessage}</span>}
                <slot name="error"/>
            </div>

            <div slot-container="hint">
                <slot name="hint"/>
            </div>

        </Host>
    }
}
