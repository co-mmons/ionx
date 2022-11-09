import {Component, Element, h, Host, Prop, Watch} from "@stencil/core";
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

    @Watch("innerWidth")
    initBreakpoints(innerWidth: BlockWidth | BlockWidthsMap) {

        if (this.breakpoints) {
            return;
        }

        if (this.hasInnerWidth(innerWidth)) {
            this.breakpoints = new WidthBreakpointsContainer(this.element);
        }
    }

    hasInnerWidth(innerWidth: BlockWidth | BlockWidthsMap) {
        return !!(innerWidth && (typeof innerWidth === "string" || Object.values(innerWidth).find(v => v && v !== "100%")));
    }


    connectedCallback() {
        this.initBreakpoints(this.innerWidth);
    }

    disconnectedCallback() {
        this.breakpoints?.disconnect();
        this.breakpoints = undefined;
    }

    render() {

        const {innerWidth} = this;
        const hasInnerWidth = this.hasInnerWidth(innerWidth);

        const defaultWidth = typeof this.innerWidth === "string" ? this.innerWidth : null;
        const widths = defaultWidth ? {} as BlockWidthsMap : (this.innerWidth ?? {}) as BlockWidthsMap;

        const xs = widths.xs || defaultWidth || null;
        const sm = widths.sm || xs || null;
        const md = widths.md || sm || null;
        const lg = widths.lg || md || null;
        const xl = widths.xl || lg || null;
        const xxl = widths.xxl || xl || null;

        const style = hasInnerWidth && {
            "--block-inner-width-xs": xs,
            "--block-inner-width-sm": sm,
            "--block-inner-width-md": md,
            "--block-inner-width-lg": lg,
            "--block-inner-width-xl": xl,
            "--block-inner-width-xxl": xxl,
        }

        return <Host
            class={{"no-margins": this.margins === false, "has-inner-width": hasInnerWidth}}
            style={style}>

            <div class="outer" block-inner-alignment={this.innerAlignment || null} part="outer">
                <div class="inner" style={this.innerStyle} part="inner">
                    <slot/>
                </div>
            </div>

        </Host>
    }
}
