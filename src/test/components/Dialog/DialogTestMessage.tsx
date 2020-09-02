import {Component, ComponentInterface, Element, h, Host, Method} from "@stencil/core";
import {DialogValue, markAsDialogValue} from "../../../components/Dialog";

@Component({
    tag: "ionx-test-dialog-message"
})
export class DialogTestMessage implements ComponentInterface, DialogValue {

    @Element()
    element: HTMLElement;

    @Method()
    dialogValue(): any {
        return this.element.querySelector("ion-input").value;
    }

    async componentDidLoad() {

        const dialog = this.element.closest<HTMLIonxDialogElement>("ionx-dialog");
        if (await dialog.didEnter()) {
            this.element.querySelector("input").focus();
        }
    }

    render() {
        return <Host {...markAsDialogValue}>
            <div>yup<b>iiii</b></div>
            <ion-input placeholder="Wprowadź kod"/>
        </Host>;
    }
}
