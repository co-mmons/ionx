import {Component, Element, h, Host} from "@stencil/core";

window["VirtualScrollerDebug"] = true;

@Component({
    tag: "ionx-test",
    styleUrl: "Test.scss",
    scoped: false
})
export class Test {

    @Element()
    element: HTMLElement;

    render() {
        return <Host>

        </Host>
    }
}
