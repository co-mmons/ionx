import {Component, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-grid-row",
    styleUrl: "RowComponent.scss"
})
export class RowComponent {

    render() {
        return <Host>
            <slot/>
        </Host>
    }
}
