import {Component, h, Host, Prop} from "@stencil/core";
import {WidthBreakpoint} from "ionx/WidthBreakpoints";

@Component({
    tag: "ionx-grid-col",
    styleUrl: "Col.scss"
})
export class Col {

    @Prop()
    sizeXs: string | number;

    @Prop()
    sizeSm: string | number;

    @Prop()
    sizeMd: string | number;

    @Prop()
    sizeLg: string | number;

    @Prop()
    sizeXl: string | number;

    @Prop()
    sizeXxl: string | number;

    render() {

        const xs = `${this.sizeXs ?? ""}` || null;
        const sm = `${this.sizeSm ?? ""}` || xs || null;
        const md = `${this.sizeMd ?? ""}` || sm || null;
        const lg = `${this.sizeLg ?? ""}` || md || null;
        const xl = `${this.sizeXl ?? ""}` || lg || null;
        const xxl = `${this.sizeXxl ?? ""}` || xl || null;

        const style = {xs, sm, md, lg, xl, xxl};

        for (const bp of WidthBreakpoint.values()) {

            if (style[bp.name] && style[bp.name] !== "auto") {
                style[`--size-${bp.name}`] = style[bp.name];
                style[`--grow-${bp.name}`] = "0";
                style[`--shrink-${bp.name}`] = "0";
            } else {
                style[`--basis-${bp.name}`] = "0";
            }

            delete style[bp.name];
        }

        return <Host style={{...style}}>
            <slot/>
        </Host>
    }
}
