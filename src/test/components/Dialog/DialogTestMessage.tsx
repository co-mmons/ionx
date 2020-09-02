import {Component, ComponentInterface, Element, h} from "@stencil/core";

@Component({
    tag: "ionx-test-dialog-message"
})
export class DialogTestMessage implements ComponentInterface {

    @Element()
    element: HTMLElement;

    async componentDidLoad() {

        const dialog = this.element.closest<HTMLIonxDialogElement>("ionx-dialog");
        if (await dialog.didEnter()) {
            this.element.querySelector("input").focus();
        }
    }

    render() {
        return <div>
            <div>yup<b>iiii</b></div>
            <ion-input placeholder="Wprowadź kod"/>
        </div>;
    }
}
