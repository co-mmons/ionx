import {modalController} from "@ionic/core/components";
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

            <ionx-block innerStyle={{background: "green"}}>no innerWidth</ionx-block>

            <ionx-block innerWidth={{md: "100%"}} innerStyle={{background: "orange"}}>always 100%</ionx-block>

            <ionx-block innerWidth={{xs: "25%", md: "50%"}} innerStyle={{background: "red"}}>aaaa</ionx-block>
        </Host>
    }
}
