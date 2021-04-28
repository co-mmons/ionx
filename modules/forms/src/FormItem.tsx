import {intl, MessageRef} from "@co.mmons/js-intl";
import {Component, h, Host, Prop, State, Watch} from "@stencil/core";
import {FormControlState} from "./FormControlState";
import {FormValidationError} from "./FormValidationError";
import {loadIntlMessages} from "./intl/loadIntlMessages";

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
    error?: string | FormValidationError | MessageRef | Error;

    @State()
    errorMessage: string;

    @Watch("control")
    watchControl() {
        this.buildErrorMessage();
    }

    @Watch("error")
    watchError() {
        this.buildErrorMessage();
    }

    buildErrorMessage() {

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

    @Prop()
    hint: string;

    @Prop()
    partProps: {
        item?: Partial<import("@stencil/core/internal").JSXBase.HTMLAttributes> & Partial<import("@ionic/core").Components.IonItem>
    }

    async componentWillLoad() {
        await loadIntlMessages();
    }

    render() {
        return <Host>

            <div ionx--buttons>
                <slot name="buttons"/>
            </div>

            <ion-item {...this.partProps?.item}>

                <slot name="start" slot="start"/>

                <slot/>

                <slot name="end" slot="end"/>

            </ion-item>

            <slot name="error"/>

            {!!this.errorMessage && <div ionx--error>{this.errorMessage}</div>}

            <slot name="hint"/>

            {!!this.hint && <div ionx--hint>{this.hint}</div>}

        </Host>;
    }
}
