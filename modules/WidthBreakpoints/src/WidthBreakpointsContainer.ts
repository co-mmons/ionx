import {MediaBreakpoint} from "ionx/utils";
import {WidthBreakpoint} from "./WidthBreakpoint";

const reversedBreakpoints = WidthBreakpoint.values().reverse();

export class WidthBreakpointsContainer {

    constructor(private readonly element: HTMLElement, private accessorName?: string) {
        this.connect();

        if (!this.accessorName) {
            this.accessorName = WidthBreakpointsContainer.defaultAccessorName;
        }
    }

    private observer: ResizeObserver;

    private resized() {

        const element = this.element;
        const style = element.style;
        const {width} = element.getBoundingClientRect();

        style.setProperty(`--${this.accessorName}`, `${width}px`);

        const queries: string[] = [];

        let breakpoint: MediaBreakpoint;

        for (const bp of reversedBreakpoints) {

            if (!breakpoint && width >= bp.minWidth) {
                breakpoint = bp;
                queries.push(`=${bp.name}`, `>=${bp.name}`, `<=${bp.name}`);
            } else if (width > bp.minWidth) {
                queries.push(`>=${bp.name}`, `>${bp.name}`);
            } else if (width < bp.minWidth) {
                queries.push(`<=${bp.name}`, `<${bp.name}`);
            }

            style.setProperty(`--${this.accessorName}-${bp.name}`, bp === breakpoint ? "\t" : "initial");
        }

        element.setAttribute(this.accessorName, queries.join(" "));
    }

    private connect() {

        if (this.observer) {
            return;
        }

        this.observer = new ResizeObserver(this.resized.bind(this));
        this.observer.observe(this.element);
    }

    disconnect() {
        this.observer.disconnect();
        this.observer = undefined;
    }
}

export namespace WidthBreakpointsContainer {
    export const defaultAccessorName = "ionx-width-breakpoints";
}
