import {Component, Host, h, Prop} from "@stencil/core";

@Component({
    tag: "ionx-dialog-message",
    shadow: true,
    styleUrl: "DialogMessage.scss"
})
export class DialogMessage {

    @Prop()
    message!: string;

    render() {
        return <Host>
            <div>{this.message}</div>
        </Host>
    }

}
