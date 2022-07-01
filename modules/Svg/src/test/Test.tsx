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

    source = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z"/></svg>`;

    async openModal() {

        const modal = await modalController.create({
            component: "ionx-test"
        });

        modal.present();

    }

    render() {
        return <Host>

            <ionx-svg src="https://appspltfrm.imgix.net/customers/r4sb2xoai4/upload/2022-6/82I7h6tLmZduAg9Rqs7YCPKqeujk23.svg"/>

            <ionx-svg source={this.source}/>
        </Host>
    }
}
