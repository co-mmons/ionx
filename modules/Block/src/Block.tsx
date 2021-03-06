import {Component, h, Host, Prop} from "@stencil/core";
import {BlockWidth} from "./BlockWidth";
import {BlockWidthsMap} from "./BlockWidthsMap";

@Component({
    tag: "ionx-block",
    styleUrl: "Block.scss",
    scoped: true
})
export class Block {

    @Prop()
    innerWidth: BlockWidth | BlockWidthsMap;

    @Prop()
    innerAlignment: "start" | "end" | "center";

    @Prop()
    innerStyle: {[key: string]: string};

    @Prop()
    margins = true;

    @Prop()
    padding = false;

    render() {

        const defaultWidth = typeof this.innerWidth === "string" ? this.innerWidth : null;
        const widths = defaultWidth ? {} as BlockWidthsMap : this.innerWidth as BlockWidthsMap;

        return <Host
            class={{"ionx--margins": !!this.margins, "ionx--has-inner-width": !!this.innerWidth}}
            style={{
                "--block-inner-width-xs": widths?.xs ? `${widths?.xs}` : defaultWidth,
                "--block-inner-width-sm": widths?.sm ? `${widths?.sm}` : defaultWidth,
                "--block-inner-width-md": widths?.md ? `${widths?.md}` : defaultWidth,
                "--block-inner-width-lg": widths?.lg ? `${widths?.lg}` : defaultWidth,
                "--block-inner-width-xl": widths?.xl ? `${widths?.xl}` : defaultWidth
            }}>

            <div ionx--outer ionx--inner-alignment={this.innerAlignment || null}>
                <div ionx--inner style={this.innerStyle}>
                    <slot/>
                </div>
            </div>

        </Host>
    }
}
