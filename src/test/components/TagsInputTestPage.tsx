import {Component, h, Host, State} from "@stencil/core";

@Component({
    tag: "ionx-test-tags-input"
})
export class TagsInputTestPage {

    @State()
    backspaceRemove: boolean;

    formValue: string[];

    render() {

        let hidden: any;

        return <Host>
            <ion-content>
                <div>
                    <div>Test {this.backspaceRemove}</div>
                    <ion-item>
                        <ion-label>canBackspaceRemove</ion-label>
                        <ion-checkbox slot="start" checked={this.backspaceRemove}
                                      onIonChange={(ev) => this.backspaceRemove = ev.target["checked"]}/>
                    </ion-item>
                    <ionx-tags-input canBackspaceRemove={this.backspaceRemove} onIonxChange={(ev) => console.log(ev)}/>
                </div>

                <hr/>

                <form onSubmit={(ev) => {
                    console.log(hidden.reportValidity());
                    ev.preventDefault();
                }}>

                    <button ref={el => hidden = el} tabindex={-1}/>

                    <ion-item>
                        <ion-label position="stacked">Form validation</ion-label>
                        <ionx-tags-input/>
                    </ion-item>

                    <ion-button onClick={() => {
                        hidden.setCustomValidity("sdsdds");
                        console.log(hidden.reportValidity());
                        console.dir(hidden)
                    }}>submit</ion-button>
                </form>
            </ion-content>
        </Host>
    }
}
