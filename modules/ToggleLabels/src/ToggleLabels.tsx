import {Component, Element, Event, EventEmitter, h, Host, Listen, Prop, Watch} from "@stencil/core";
import type {Components as ionic} from "@ionic/core";
import {prefetchComponent} from "ionx/utils";

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

    /**
     * If default toggle should be created instead of user-defined.
     */
    @Prop()
    defaultToggle: boolean;

    @Prop()
    readonly: boolean;

    @Prop()
    disabled: boolean;

    @Prop({mutable: true})
    value: boolean;

    /**
     * @internal
     */
    @Prop()
    prefetch: boolean;

    @Event()
    ionChange: EventEmitter<{value: boolean, checked: boolean}>;

    initialToggleState: {checked: boolean, disabled: boolean};

    private get toggle() {
        return this.element.querySelector<HTMLElement & ionic.IonToggle>("ion-toggle");
    }

    switchToggle(state: "on" | "off" | "auto") {
        if (!this.disabled && !this.readonly) {
            const toggle = this.toggle;
            toggle.checked = state === "auto" ? !toggle.checked : state === "on";
        }
    }

    @Listen("ionChange")
    toggleChanged(ev: CustomEvent) {

        if (this.defaultToggle && ev.target !== this.element) {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            ev.stopPropagation();
        }

        const was = this.value;
        this.value = this.toggle.checked;

        if (was !== this.value) {
            this.ionChange.emit({value: this.value, checked: this.value});
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

    componentDidLoad() {
        prefetchComponent({delay: 0}, "ion-toggle");
    }

    connectedCallback() {
        this.initialToggleState = {checked: this.value, disabled: this.readonly || this.disabled};
    }

    render() {

        if (this.prefetch) {
            return;
        }

        return <Host class={{"ionx--interactive": !this.disabled && !this.readonly, "ionx--readonly": this.readonly}}>

            {this.readonly && <span>{this.value ? this.on : this.off}</span>}

            <span class="ionx--off" onClick={() => this.switchToggle(this.on ? "off" : "auto")}>
                {this.off && <span>{this.off}</span>}
                <slot name="off"/>
            </span>

            {this.defaultToggle && <ion-toggle class="ionx--default-toggle" {...this.initialToggleState}/>}

            <slot/>

            <span class="ionx--on" onClick={() => this.switchToggle(this.off ? "on" : "auto")}>
                {this.on && <span>{this.on}</span>}
                <slot name="on"/>
            </span>

        </Host>;
    }

}
