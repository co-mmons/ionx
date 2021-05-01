import {Component, h} from "@stencil/core";
import {showContextMenu} from "../showContextMenu";

@Component({
    tag: "ionx-module-test"
})
export class Test {

    render() {
        return <ion-button onClick={ev => showContextMenu(ev,[
            {label: "oalala", handler: () => alert("yeeee"), iconName: "reload"}
        ])}>open</ion-button>
    }
}
