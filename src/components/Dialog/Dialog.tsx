import {HtmlString} from "@co.mmons/js-utils/core";
import {OverlayEventDetail} from "@ionic/core";
import {Component, Element, h, Host, Listen, Method, Prop} from "@stencil/core";
import {Subject} from "rxjs";
import {first} from "rxjs/operators";
import {DialogButton} from "./DialogButton";
import {DialogOptions} from "./DialogOptions";

@Component({
    tag: "ionx-dialog"
})
export class Dialog implements DialogOptions {

    @Element()
    element: HTMLElement;

    /**
     * @inheritDoc
     */
    @Prop()
    header?: string;

    /**
     * @inheritDoc
     */
    @Prop()
    subheader?: string;

    /**
     * @inheritDoc
     */
    @Prop()
    component?: string;

    /**
     * @inheritDoc
     */
    @Prop()
    componentProps?: {[prop: string]: any};

    /**
     * @inheritDoc
     */
    @Prop()
    message?: string | HtmlString;

    /**
     * @inheritDoc
     */
    @Prop()
    messageComponent?: string;

    /**
     * @inheritDoc
     */
    @Prop()
    messageComponentProps?: {[prop: string]: any};

    /**
     * @inheritDoc
     */
    @Prop()
    buttons?: DialogButton[];

    #didEnter = new Subject<true>();

    /**
     * A promise resolved when dialog was fully presented.
     */
    @Method()
    onDidEnter(): Promise<true> {
        return this.#didEnter.pipe(first()).toPromise();
    }

    @Listen("ionViewDidEnter")
    ionDidEnter() {
        this.#didEnter.next(true);
    }

    @Method()
    onDidDismiss(): Promise<OverlayEventDetail<any>> {
        return this.element.closest("ion-modal").onDidDismiss();
    }

    @Method()
    onWillDismiss(): Promise<OverlayEventDetail<any>> {
        return this.element.closest("ion-modal").onWillDismiss();
    }

    render() {

        const Component = this.component;
        const Message = this.messageComponent;

        return <Host style={{display: "flex", position: "initial", contain: "initial"}}>
            {this.component && <Component {...this.componentProps}/>}

            {!this.component && <ionx-dialog-content>

                {(this.header || this.subheader) && <ionx-dialog-headers slot="header" header={this.header} subheader={this.subheader}/>}

                {this.messageComponent && <Message {...this.messageComponentProps} slot="message"/>}

                {!this.messageComponent && this.message && <ionx-dialog-message message={this.message} slot="message"/>}

                {this.buttons && this.buttons.length && <ionx-dialog-buttons buttons={this.buttons} slot="footer"/>}

            </ionx-dialog-content>}
        </Host>
    }

}
