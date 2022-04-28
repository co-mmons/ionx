import {modalController} from "@ionic/core";
import {Component, Element, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-test",
    styleUrl: "Test.scss",
    scoped: true
})
export class Test {

    @Element()
    element: HTMLElement;

    async openModal() {

        const modal = await modalController.create({
            component: "ionx-test"
        });

        modal.present();

    }

    render() {
        return <Host>
            <ionx-block innerWidth={{md: "50%"}} innerStyle={{background: "red"}}>aaaa</ionx-block>
        </Host>
    }
}
