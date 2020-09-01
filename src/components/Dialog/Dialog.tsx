import {Component, h, Host, Prop} from "@stencil/core";
import {DialogButton} from "./DialogButton";

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
    component?: string;

    @Prop()
    componentProps?: {[prop: string]: any};

    @Prop()
    message?: string;

    @Prop()
    messageComponent?: string;

    @Prop()
    messageComponentProps?: {[prop: string]: any};

    @Prop()
    buttons?: DialogButton[];

    render() {

        const Component = this.component;
        const Message = this.messageComponent;

        return <Host style={{display: "flex", position: "initial", contain: "initial"}}>
            {this.component && <Component {...this.componentProps}/>}

            {!this.component && <ionx-dialog-content>

                {(this.header || this.subheader) && <ionx-dialog-headers slot="header" header={this.header} subheader={this.subheader}/>}

                {this.messageComponent && <Message {...this.messageComponent} slot="content"/>}

                {!this.messageComponent && this.message && <ionx-dialog-message message={this.message} slot="content"/>}

                {this.buttons && this.buttons.length && <ionx-dialog-buttons buttons={this.buttons} slot="footer"/>}

            </ionx-dialog-content>}
        </Host>
    }

}
