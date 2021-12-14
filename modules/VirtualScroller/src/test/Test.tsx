import {Component, Element, h, Host, State} from "@stencil/core";
import {loremIpsum} from "./loremIpsum";

window["VirtualScrollerDebug"] = true;

@Component({
    tag: "ionx-test",
    styleUrl: "Test.scss",
    scoped: false
})
export class Test {

    @Element()
    element: HTMLElement;

    @State()
    items = new Array(100).fill(undefined).map((_v, id)=> ({id, label: loremIpsum.substr(0, Math.random() * 400)}));

    renderItem(item: any) {
        return <ion-item key={item.id}>
            <ion-label>
                <small>{item.id}</small>
                <div>{item.label}</div>
            </ion-label>
        </ion-item>
    }

    render() {
        return <Host>
            <div style={{position: "sticky", top: "0", left: "0", zIndex: "100"}} >

                <ion-button onClick={() => this.items = [{id: 0, label: "ahahah"}].concat(this.items.slice().splice(1))}>change first item</ion-button>

                <ion-button onClick={() => this.items = this.items.slice().splice(1)}>remove first item</ion-button>

            </div>
            <ion-list lines="full">
                <ionx-virtual-scroller
                    itemKey={item => item.id}
                    renderItem={this.renderItem}
                    items={this.items}/>
            </ion-list>

        </Host>
    }
}