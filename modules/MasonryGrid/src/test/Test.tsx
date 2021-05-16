import {Component, h, Host} from "@stencil/core";

@Component({
    tag: "ionx-test"
})
export class Test {

    render() {
        return <Host>
            <ionx-masonry-grid block={true}>
                <ion-card>
                    <ion-title>test</ion-title>
                </ion-card>
            </ionx-masonry-grid>
        </Host>
    }
}
