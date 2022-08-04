import {intl, MessageRef} from "@co.mmons/js-intl";
import {Component, ComponentInterface, Event, EventEmitter, h, Host, Method, Prop, State, Watch} from "@stencil/core";
import {FormControlState} from "./FormControlState";
import {FormValidationError} from "./FormValidationError";
import {loadIntlMessages} from "./intl/loadIntlMessages";

@Component({
    tag: "ionx-form-field",
    scoped: true,
    styleUrl: "FormField.scss"
})
export class FormField implements ComponentInterface {

    @Prop()
    label?: string;

    @Prop()
    flexContent?: boolean;

    @Prop({reflect: true, mutable: true})
    expanded?: boolean;

    @Prop({reflect: true})
    collapsible?: boolean;

    @Prop()
    control?: FormControlState;

    @Prop()
    error?: string | FormValidationError | MessageRef | Error;

    @State()
    errorMessage: string;

    @Event()
    expandCollapse: EventEmitter<boolean>;

    @Method()
    async toggleExpanded() {
        this.expanded = !this.expanded;
    }

    @Method()
    async setExpanded(expanded: boolean) {
        this.expanded = expanded;
    }

    @Watch("control")
    @Watch("error")
    watchErrorProps() {
        this.buildErrorMessage();
    }

    async expandCollapseClicked() {
        await this.toggleExpanded();
        this.expandCollapse.emit(this.expanded);
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

    async componentWillLoad() {
        await loadIntlMessages();
    }

    render() {

        return <Host class={{"ionx--has-error": !!this.errorMessage}}>
            <fieldset>

                <legend>
                    <div key="label" slot-container="label">
                        <slot name="label">{this.label}</slot>
                    </div>

                    <div key="label-end" slot-container="label-end">
                        <slot name="label-end"/>
                    </div>

                    {this.collapsible && <ion-button class="ionx--expand-toggle" shape="round" size="small" fill="clear" onClick={() => this.expandCollapseClicked()}>
                        <ion-icon name="chevron-up" slot="icon-only"/>
                    </ion-button>}
                </legend>

                <div key="description" slot-container="description">
                    <slot name="description"/>
                </div>

                <div key="placeholder" slot-container="placeholder">
                    <slot name="placeholder"/>
                </div>

                <div ionx--content style={{display: this.flexContent ? "flex" : "block"}}>

                    <div key="start" slot-container="start">
                        <slot name="start"/>
                    </div>

                    <div key="default" slot-container="default">
                        <slot/>
                    </div>

                    <div key="end" slot-container="end">
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
