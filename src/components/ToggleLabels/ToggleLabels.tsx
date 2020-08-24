import {Component, Element, h, Host, Prop} from "@stencil/core";

@Component({
    tag: "ionx-toggle-labels",
    styleUrl: "ToggleLabels.scss",
    shadow: true
})
export class ToggleLabels {

    @Prop()
    on: string;

    @Prop()
    off: string;

    @Element()
    private el: HTMLElement;

    private get toggle() {
        return this.el.querySelector<HTMLIonToggleElement>("ion-toggle");
    }

    switchOn() {
        this.toggle.checked = true;
    }

    switchOff() {
        this.toggle.checked = false;
    }

    render() {
        return <Host>

            <span class="off" onClick={() => this.switchOff()}>
                {this.off && <span>{this.off}</span>}
                <slot name="off"/>
            </span>

            <slot/>

            <span class="on" onClick={() => this.switchOn()}>
                {this.on && <span>{this.on}</span>}
                <slot name="on"/>
            </span>

        </Host>;
    }

}
