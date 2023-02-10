import {popoverController} from "@ionic/core/components";
import {Component, Element, Prop, h} from "@stencil/core";
import {ContextMenuItem} from "./ContextMenuItem";

@Component({
    tag: "ionx-context-menu",
    styleUrl: "ContextMenu.scss",
    scoped: true
})
export class ContextMenu {

    @Element()
    element: HTMLElement;

    @Prop()
    items!: ContextMenuItem[];

    async itemClicked(item: ContextMenuItem) {
        await popoverController.dismiss();
        try {
            item.handler();
        } catch (e) {
            console.warn(e);
        }
    }

    render() {
        return <ion-list>
            {this.items.map(item => <ion-item button={true} disabled={item.disabled} detail={false} onClick={() => this.itemClicked(item)}>
                {(item.iconSrc || item.iconName) && <ion-icon color={item.color} name={item.iconName} src={item.iconSrc} size="small" slot="start"/>}
                <ion-label color={item.color}>{item.label}</ion-label>
            </ion-item>)}
        </ion-list>
    }

}
