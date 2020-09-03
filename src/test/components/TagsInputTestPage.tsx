import {Component, Host, h, State} from "@stencil/core";

@Component({
    tag: "ionx-test-tags-input"
})
export class TagsInputTestPage {

    @State()
    backspaceRemove: boolean = true;

    render() {

        return <Host>
            <div>
                <div>Test</div>
                <ion-item>
                    <ion-label>canBackspaceRemove</ion-label>
                    <ion-checkbox slot="start" checked={this.backspaceRemove} onIonChange={(ev) => this.backspaceRemove = ev.returnValue}/>
                </ion-item>
                <ionx-tags-input canBackspaceRemove={this.backspaceRemove}/>
            </div>
        </Host>
    }
}
