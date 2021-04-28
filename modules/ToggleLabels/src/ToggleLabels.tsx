import {Component, Element, Event, EventEmitter, h, Host, Listen, Prop, Watch} from "@stencil/core";

@Component({
    tag: "ionx-toggle-labels",
    styleUrl: "ToggleLabels.scss",
    scoped: true
})
export class ToggleLabels {

    @Element()
    element: HTMLElement;

    @Prop()
    on: string;

    @Prop()
    off: string;

    @Prop()
    readonly: boolean;

    @Prop()
    disabled: boolean;

    @Prop({mutable: true})
    value: boolean;

    @Event()
    ionChange: EventEmitter<{value: boolean}>;

    initialToggleState: {checked: boolean, disabled: boolean};

    private get toggle() {
        return this.element.querySelector<HTMLIonToggleElement>("ion-toggle");
    }

    switchToggle(state: "on" | "off") {
        if (!this.disabled && !this.readonly) {
            this.toggle.checked = state === "on";
        }
    }

    @Listen("ionChange")
    toggleChanged() {

        const was = this.value;
        this.value = this.toggle.checked;

        if (was !== this.value) {
            this.ionChange.emit({value: this.value});
        }
    }

    @Watch("value")
    valueChanged() {
        if (this.toggle.checked !== this.value) {
            this.toggle.checked = this.value;
        }
    }

    @Watch("readonly")
    @Watch("disabled")
    syncToggle() {
        const toggle = this.toggle;
        toggle.disabled = this.readonly || this.disabled;
    }

    connectedCallback() {
        this.initialToggleState = {checked: this.value, disabled: this.readonly || this.disabled};
    }

    render() {
        return <Host class={{"ionx--interactive": !this.disabled && !this.readonly, "ionx--readonly": this.readonly}}>

            {this.readonly && <span>{this.value ? this.on : this.off}</span>}

            <span class="ionx--off" onClick={() => this.switchToggle("off")}>
                {this.off && <span>{this.off}</span>}
                <slot name="off"/>
            </span>

            <slot>
                <ion-toggle class="ionx--default-toggle" {...this.initialToggleState}/>
            </slot>

            <span class="ionx--on" onClick={() => this.switchToggle("on")}>
                {this.on && <span>{this.on}</span>}
                <slot name="on"/>
            </span>

        </Host>;
    }

}
