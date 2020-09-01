import {Component, Prop, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-dialog-headers",
    styleUrl: "DialogHeaders.scss",
    shadow: true
})
export class DialogHeaders {

    @Prop()
    header?: string;

    @Prop()
    subheader?: string;

    render() {
        return <Host>

            {this.header && <div ionx--header>{this.header}</div>}

            {this.subheader && <div ionx--subheader>{this.subheader}</div>}

        </Host>
    }
}
