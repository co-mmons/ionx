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

                <div hide-when="=xs">hide test</div>
            </ionx-width-breakpoints>

        </Host>
    }
}
