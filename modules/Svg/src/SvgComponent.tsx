import {Component, h, Host, Prop} from "@stencil/core";

@Component({
    tag: "ionx-svg",
    styleUrl: "SvgComponent.scss",
    shadow: true
})
export class SvgComponent {

    @Prop()
    source!: string | ArrayBuffer;

    render() {

        let xml: string;
        if (typeof this.source === "string") {
            xml = this.source;
        } else if (this.source instanceof ArrayBuffer) {
            xml = new TextDecoder().decode(this.source);
        }

        return <Host>
            <span innerHTML={xml}/>
        </Host>;
    }
}
