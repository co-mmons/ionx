import {Component, h, Prop} from "@stencil/core";

@Component({
    tag: "ionx-svg",
    styleUrl: "Svg.scss",
    shadow: true
})
export class Svg {

    @Prop()
    svg!: string;

    render() {
        return <span innerHTML={this.svg}/>;
    }
}
