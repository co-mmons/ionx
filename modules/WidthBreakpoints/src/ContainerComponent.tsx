import {Component, ComponentInterface, Element, h, Host, Prop} from "@stencil/core";
import {WidthBreakpointsContainer} from "./WidthBreakpointsContainer";

@Component({
    tag: "ionx-width-breakpoints",
    styleUrl: "ContainerComponent.scss"
})
export class ContainerComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    accessorName: string;

    container: WidthBreakpointsContainer;

    /**
     * @internal
     */
    @Prop()
    prefetch: boolean;

    connectedCallback() {
        this.container = new WidthBreakpointsContainer(this.element, this.accessorName);
    }

    disconnectedCallback() {
        this.container.disconnect();
        this.container = undefined;
    }

    render() {

        if (this.prefetch) {
            return;
        }

        return <Host>
        </Host>;
    }

}
