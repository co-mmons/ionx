import {Component, h, Host} from "@stencil/core";
import {showLoadingOverlay} from "../showLoadingOverlay";

@Component({
    tag: "ionx-test"
})
export class Test {

    render() {
        return <Host>
            <ion-button onClick={() => showLoadingOverlay({
                message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
                type: "spinner",
                progressMessage: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
                progressType: "indeterminate",
                progressPercent: .2
            })}></ion-button>
        </Host>
    }
}
