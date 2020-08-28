import {Component, h, Host, Prop} from "@stencil/core";

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
    error: string;

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

            {!!this.error && <div ionx--error>{this.error}</div>}

            <slot name="hint"/>

            {!!this.hint && <div ionx--hint>{this.hint}</div>}

        </Host>;
    }
}
