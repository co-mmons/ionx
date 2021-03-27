import {Component, Element, h, Host} from "@stencil/core";
import {defineCustomElements as defineIonxBlock} from "ionx/Block";

defineIonxBlock();

@Component({
    tag: "ionx-html-editor",
    styleUrl: "HtmlEditor.scss",
    shadow: true
})
export class HtmlEditor {

    @Element()
    element: HTMLElement;

    async loadIntl() {
    }

    connectedCallback() {
        console.log("html eidtor loaderd");
    }

    dooo() {
        const block = this.element.shadowRoot.querySelector("ionx-block");
        block.margins = false;
    }

    render() {
        return <Host>
            <ionx-block innerWidth="80%">sdsdsd</ionx-block>
            <button onClick={() => this.dooo()}>sdds</button>
        </Host>
    }

}
