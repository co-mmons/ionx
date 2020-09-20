import {HtmlString} from "@co.mmons/js-utils/core";
import {Component, Host, h, Prop} from "@stencil/core";

@Component({
    tag: "ionx-dialog-message",
    shadow: true,
    styleUrl: "DialogMessage.scss"
})
export class DialogMessage {

    @Prop()
    message?: string | HtmlString;

    render() {
        return <Host>
            {this.message && (this.message instanceof HtmlString ? <div innerHTML={this.message.toString()}/> : <div>{this.message}</div>)}
            <slot/>
        </Host>
    }

}
