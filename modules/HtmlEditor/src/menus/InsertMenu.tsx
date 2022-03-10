import {intl, MessageRef, translate} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core";
import {Component, ComponentInterface, h, Listen, Prop} from "@stencil/core";
import {InsertMenuItem} from "./InsertMenuItem";

@Component({
    tag: "ionx-html-editor-insert-menu",
    styleUrl: "InsertMenu.scss",
    shadow: true
})
export class InsertMenu implements ComponentInterface {

    @Prop()
    editor!: HTMLIonxHtmlEditorElement;

    @Prop()
    items!: InsertMenuItem[];

    @Listen("ionViewDidLeave")
    didDismiss() {
        this.editor.setFocus();
    }

    async handleItem(item: InsertMenuItem) {
        popoverController.dismiss();
        const view = await this.editor.getView();
        item.handler(view);
    }

    render() {
        return <ion-list lines="full">

            {this.items.map(item => <ion-item button disabled={item.disabled} detail={false} onClick={() => this.handleItem(item)}>

                {(item.iconName || item.iconSrc) && <ion-icon name={item.iconName} src={item.iconSrc} slot="start"/>}

                <ion-label>
                    <div>{item.label instanceof MessageRef ? translate(intl, item.label) : item.label}</div>
                    {item.sublabel && <small>{item.sublabel}</small>}
                </ion-label>
            </ion-item>)}

        </ion-list>
    }
}
