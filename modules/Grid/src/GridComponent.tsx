import {Component, Element, h, Host} from "@stencil/core";
import {WidthBreakpointsContainer} from "ionx/WidthBreakpoints";

@Component({
    tag: "ionx-grid",
    styleUrl: "GridComponent.scss"
})
export class GridComponent {

    @Element()
    element: HTMLElement;

    breakpoints: WidthBreakpointsContainer;

    connectedCallback() {
        this.breakpoints = new WidthBreakpointsContainer(this.element);
    }

    disconnectedCallback() {
        this.breakpoints.disconnect();
        this.breakpoints = undefined;
    }

    render() {
        return <Host>
            <slot/>
        </Host>
    }
}
