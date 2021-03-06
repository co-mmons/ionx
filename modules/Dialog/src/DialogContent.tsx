import {Component, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-dialog-content",
    styleUrl: "DialogContent.scss",
    shadow: true
})
export class DialogContent {

    render() {
        return <Host>

            <slot name="header"/>

            <slot name="message"/>

            <slot name="footer"/>

        </Host>
    }
}
