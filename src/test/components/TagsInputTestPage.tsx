import {Component, Host, h, State} from "@stencil/core";

@Component({
    tag: "ionx-test-tags-input"
})
export class TagsInputTestPage {

    @State()
    backspaceRemove: boolean;

    render() {

        return <Host>
            <div>
                <div>Test {this.backspaceRemove}</div>
                <ion-item>
                    <ion-label>canBackspaceRemove</ion-label>
                    <ion-checkbox slot="start" checked={this.backspaceRemove} onIonChange={(ev) => this.backspaceRemove = ev.target["checked"]}/>
                </ion-item>
                <ionx-tags-input canBackspaceRemove={this.backspaceRemove} onIonxChange={(ev) => console.log(ev)}/>
            </div>
        </Host>
    }
}
