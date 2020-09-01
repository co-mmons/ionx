import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-test-loading"
})
export class LoadingTestPage {

    render() {

        let count = 1;

        return <Host>
            <div>
                <div>Test {count++}</div>
                <ionx-loading type="spinner"/>
            </div>
        </Host>
    }
}
