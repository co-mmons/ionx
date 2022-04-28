import {Component, Element, h, Host, Prop} from "@stencil/core";
import {WidthBreakpointsContainer} from "ionx/WidthBreakpoints";
import {BlockWidth} from "./BlockWidth";
import {BlockWidthsMap} from "./BlockWidthsMap";

@Component({
    tag: "ionx-block",
    styleUrl: "Block.scss",
    shadow: true
})
export class Block {

    @Element()
    element: HTMLElement;

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

    breakpoints: WidthBreakpointsContainer;

    connectedCallback() {
        this.breakpoints = new WidthBreakpointsContainer(this.element);
    }

    disconnectedCallback() {
        this.breakpoints.disconnect();
        this.breakpoints = undefined;
    }

    render() {

        const defaultWidth = typeof this.innerWidth === "string" ? this.innerWidth : null;
        const widths = defaultWidth ? {} as BlockWidthsMap : this.innerWidth as BlockWidthsMap;

        const xs = widths.xs || defaultWidth || null;
        const sm = widths.sm || xs || null;
        const md = widths.md || sm || null;
        const lg = widths.lg || md || null;
        const xl = widths.xl || lg || null;
        const xxl = widths.xxl || xl || null;

        return <Host
            class={{"ionx--no-margins": this.margins === false, "ionx--has-inner-width": !!this.innerWidth}}
            style={{
                "--block-inner-width-xs": xs,
                "--block-inner-width-sm": sm,
                "--block-inner-width-md": md,
                "--block-inner-width-lg": lg,
                "--block-inner-width-xl": xl,
                "--block-inner-width-xxl": xxl,
            }}>

            <div ionx--outer ionx--inner-alignment={this.innerAlignment || null} part="outer">
                <div ionx--inner style={this.innerStyle} part="inner">
                    <slot/>
                </div>
            </div>

        </Host>
    }
}
