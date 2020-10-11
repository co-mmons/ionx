import {Component, Element, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-date-time",
    styleUrl: "DateTimeInput.scss",
    shadow: true
})
export class Loading {

    @Element()
    element: HTMLElement;

    render() {
        return <Host>
        </Host>;
    }
}
