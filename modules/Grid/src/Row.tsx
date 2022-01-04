import {Component, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-grid-row",
    styleUrl: "Row.scss"
})
export class Row {

    render() {
        return <Host>
            <slot/>
        </Host>
    }
}
