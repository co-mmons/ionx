import {intl, MessageRef} from "@co.mmons/js-intl";
import {Component, h, Host, Prop} from "@stencil/core";
import {FormControlState} from "./FormControlState";
import {FormValidationError} from "./FormValidationError";

@Component({
    tag: "ionx-form-item",
    styleUrl: "FormItem.scss",
    scoped: true
})
export class FormItem {

    /**
     * This attributes determines the background and border color of the form item.
     * By default, items have a clear background and no border.
     */
    @Prop({reflect: true})
    fill: "clear" | "solid" | "outline";

    @Prop()
    control?: FormControlState;

    @Prop()
    error?: string | FormValidationError | MessageRef;

    get errorMessage() {
        if (typeof this.error === "string") {
            return this.error;
        } else if (this.error instanceof FormValidationError) {
            return this.error.message;
        } else if (this.error instanceof MessageRef) {
            return intl.message(this.error);
        } else if (this.error) {
            return `${this.error}`;
        } else if (this.control?.error) {
            return this.control.error.message || this.control.error.name;
        }
    }

    @Prop()
    hint: string;

    render() {
        return <Host>

            <div ionx--buttons>
                <slot name="buttons"/>
            </div>

            <ion-item>

                <slot name="start" slot="start"/>

                <slot/>

                <slot name="end" slot="end"/>

            </ion-item>

            <slot name="error"/>

            {!!this.error && <div ionx--error>{this.errorMessage}</div>}

            <slot name="hint"/>

            {!!this.hint && <div ionx--hint>{this.hint}</div>}

        </Host>;
    }
}
