import {Component, h, Host} from "@stencil/core";
import {defineIonxToolbar} from "ionx/Toolbar";

defineIonxToolbar();

@Component({
    tag: "ionx-test-page2"
})
export class Page2 {

    render() {
        return <Host>

            <ion-header>
                <ionx-toolbar button="back"/>
            </ion-header>

            <ion-content>
                <div>ahahahah</div>
            </ion-content>
        </Host>
    }}
