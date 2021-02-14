import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-input-group",
    scoped: true,
    styleUrl: "InputGroup.scss"
})
export class InputGroup {

    render() {
        return <Host>
            <slot/>
        </Host>
    }
}
