import {Component, h, Host} from "@stencil/core";
import {defineIonxForms} from "ionx/forms";

defineIonxForms()

@Component({
    tag: "ionx-test"
})
export class Test {

    render() {
        return <Host>
            <ionx-grid>
                <ionx-grid-row>
                    <ionx-grid-col style={{border: "1px solid green"}}>test md8<div>adsdsd</div><div>sdsd</div></ionx-grid-col>
                    <ionx-grid-col sizeMd={8} style={{border: "1px solid orange"}}>test 12</ionx-grid-col>
                </ionx-grid-row>

                <ionx-grid-row>
                    <ionx-grid-col sizeXs={6} style={{border: "1px solid green"}}>test md8<div>adsdsd</div><div>sdsd</div></ionx-grid-col>
                    <ionx-grid-col sizeXs={6} style={{border: "1px solid orange"}}>test 12</ionx-grid-col>
                </ionx-grid-row>
            </ionx-grid>

            <ion-grid>
                <ion-row>
                    <ion-col size-xs={6} style={{border: "1px solid red"}}>test auto</ion-col>
                    <ion-col size-xs={6} style={{border: "1px solid green"}}>test md8</ion-col>
                </ion-row>
            </ion-grid>
        </Host>
    }
}
