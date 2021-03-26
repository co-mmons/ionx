import {setMessages} from "@co.mmons/js-intl";
import {Component, Element, h, Host} from "@stencil/core";
import {defineCustomElements} from "ionx/Block";

defineCustomElements();

let ulalala: string;

@Component({
    tag: "ionx-html-editor",
    styleUrl: "HtmlEditor.scss",
    shadow: true
})
export class HtmlEditor {

    @Element()
    element: HTMLElement;

    async loadIntl() {
        ulalala = window["INTL_LOCALE"];

        if (ulalala === "pl") {
            setMessages("@ionx/html-editor", ulalala, (await import("./intl/pl.json")) as any);
        }

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
