import {Component, h, Host, Prop} from "@stencil/core";

export type TagName = string;

@Component({
    tag: "ionx-dialog"
})
export class Dialog {

    @Prop()
    header?: string;

    @Prop()
    subheader?: string;

    /**
     * Name of the tag, that should be displayed inside....
     */
    @Prop()
    component?: TagName;

    @Prop()
    componentProps?: {[prop: string]: any};

    @Prop()
    message?: string;

    @Prop()
    messageComponent?: string;

    @Prop()
    messageComponentProps?: {[prop: string]: any};

    render() {

        const Component = this.component;
        const Message = this.messageComponent;

        return <Host style={{display: "block"}}>
            {this.component && <Component {...this.componentProps}/>}

            {!this.component && <ionx-dialog-content>

                {(this.header || this.subheader) && <ionx-dialog-headers header={this.header} subheader={this.subheader}/>}

                {this.messageComponent && <Message {...this.messageComponent}/>}

                {!this.messageComponent && this.message && <ionx-dialog-message message={this.message}/>}

            </ionx-dialog-content>}
        </Host>
    }

}
