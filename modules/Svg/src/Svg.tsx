import {Component, h, Prop} from "@stencil/core";

@Component({
    tag: "ionx-svg",
    styleUrl: "Svg.scss",
    shadow: true
})
export class Svg {

    @Prop()
    svg!: string | ArrayBuffer;

    render() {

        let xml: string;
        if (typeof this.svg === "string") {
            xml = this.svg;
        } else if (this.svg instanceof ArrayBuffer) {
            xml = new TextDecoder().decode(this.svg);
        }

        return <span innerHTML={xml}/>;
    }
}
