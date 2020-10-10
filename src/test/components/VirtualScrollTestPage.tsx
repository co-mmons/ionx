import {Component, Host, h, State} from "@stencil/core";

@Component({
    tag: "ionx-test-virtual-scroll"
})
export class VirtualScrollTestPage {

    @State()
    items: any[];

    connectedCallback() {
        this.items = Array.from({length: 500}).map((_e, i) => `${i}`);
    }

    changeItem() {
        this.items = this.items.slice(0, 200);
    }

    renderItem(index: number) {
        return <ion-item>
            <ion-checkbox slot="start"/>
            <ion-label>{this.items[index]}</ion-label>
        </ion-item>;
    }

    render() {

        return <Host>
            <ion-content>
                {/*<ion-button slot="fixed" style={{zIndex: "10000"}} onClick={() => this.changeItem()}>change</ion-button>*/}
                <ionx-virtual-scroll
                    items={this.items}
                    renderer={this.renderItem.bind(this)}
                    itemHeight={30}/>
            </ion-content>
        </Host>
    }
}
