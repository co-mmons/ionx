import {Component, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-test",
    scoped: true,
    styleUrl: "Test.scss"
})
export class Test {

    render() {
        return <Host>

            <ionx-width-breakpoints>
                <small>test</small>
            </ionx-width-breakpoints>

        </Host>
    }
}
