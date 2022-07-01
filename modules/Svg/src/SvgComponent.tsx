import {Component, ComponentInterface, Element, forceUpdate, h, Host, Prop, Watch} from "@stencil/core";
import {downloadFile} from "ionx/utils";

@Component({
    tag: "ionx-svg",
    styleUrl: "SvgComponent.scss",
    shadow: true
})
export class SvgComponent implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop({mutable: true, reflect: true})
    src: string;

    @Prop({mutable: true})
    source: string | ArrayBuffer;

    srcSource: string | ArrayBuffer;

    @Watch("source")
    sourceChanged(source: string | ArrayBuffer) {
        if (source) {
            this.src = undefined;
            this.srcSource = undefined;
        }
    }

    @Watch("src")
    async loadSrc(src: string) {
        if (src) {
            this.source = undefined;

            try {
                this.srcSource = await downloadFile(src, "text");
                this.element.dispatchEvent(new Event("load"));

            } catch (error) {
                console.error(error);
                this.element.dispatchEvent(new Event("error"));
            }

            forceUpdate(this);
        }
    }

    async componentWillLoad() {
        if (this.src) {
            await this.loadSrc(this.src);
        }
    }

    render() {

        const source = this.srcSource ?? this.source;

        let xml: string;
        if (typeof source === "string") {
            xml = source;
        } else if (source instanceof ArrayBuffer) {
            xml = new TextDecoder().decode(source);
        }

        return <Host>
            <span innerHTML={xml}/>
        </Host>;
    }
}
