import {Component, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-test",
    styleUrl: "Test.scss",
    scoped: true
})
export class Test {

    render() {
        return <Host>
            <ion-header>
                <ionx-toolbar button="back"/>
            </ion-header>
            <ion-content>
                <div style={{border: "1px solid red", margin: "16px"}}>test</div>
            </ion-content>
        </Host>
    }
}
