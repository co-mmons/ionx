import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-html-editor-test"
})
export class HtmlEditorTest {

    private value = `siała <b>baba</b> <a href="http://www.onet.pl" target="_blank">mak</a>`;

    render() {
        return <Host>
            <ionx-html-editor value={this.value}/>
        </Host>
    }
}
