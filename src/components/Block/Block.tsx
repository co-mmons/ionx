import {Component, h, Host, Prop} from "@stencil/core";

type WidthValue = string;
type WidthsMap = {xs?: WidthValue, sm?: WidthValue, md?: WidthValue, lg?: WidthValue, xl?: WidthValue};

@Component({
    tag: "ionx-block",
    styleUrl: "Block.scss",
    scoped: true
})
export class Block {

    @Prop()
    innerWidth: WidthValue | WidthsMap;

    @Prop()
    innerAlignment: "start" | "end" | "center";

    @Prop()
    margins = true;

    @Prop()
    padding = false;

    render() {

        const defaultWidth = typeof this.innerWidth === "string" ? this.innerWidth : null;
        const widths = defaultWidth ? {} as WidthsMap : this.innerWidth as WidthsMap;

        return <Host
            class={{"ionx--margins": !!this.margins}}
            style={{
                "--block-inner-width-xs": widths?.xs ? `${widths?.xs}` : defaultWidth,
                "--block-inner-width-sm": widths?.sm ? `${widths?.sm}` : defaultWidth,
                "--block-inner-width-md": widths?.md ? `${widths?.md}` : defaultWidth,
                "--block-inner-width-lg": widths?.lg ? `${widths?.lg}` : defaultWidth,
                "--block-inner-width-xl": widths?.xl ? `${widths?.xl}` : defaultWidth
            }}>

            <div ionx--outer ionx--inner-alignment={this.innerAlignment || null}>
                <div ionx--inner>
                    <slot/>
                </div>
            </div>

        </Host>
    }
}
