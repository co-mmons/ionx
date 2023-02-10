import {Component, h, Host} from "@stencil/core";
import {showContextMenu} from "../showContextMenu";
import {defineCustomElement as defineIonApp} from "@ionic/core/components/ion-app";
import {defineCustomElement as defineIonContent} from "@ionic/core/components/ion-content";
import {defineCustomElement as defineIonButton} from "@ionic/core/components/ion-button";

defineIonApp();
defineIonContent();
defineIonButton();

@Component({
    tag: "ionx-module-test"
})
export class Test {

    render() {
        return <Host style={{display: "block"}}>
            <ion-app>
                <ion-content>
                    <ion-button onClick={ev => showContextMenu(ev,[
                        {label: "oalala", handler: () => alert("yeeee"), iconName: "reload"},
                        {label: "test 2", handler: () => alert("yeeee22"), iconName: "glob"}
                    ])}>open</ion-button>
                </ion-content>
            </ion-app>
        </Host>
    }
}
