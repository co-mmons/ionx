import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-dialog-content",
    styleUrl: "DialogContent.scss",
    shadow: true
})
export class DialogContent {

    render() {
        return <Host>
            <slot/>
        </Host>
    }
}
