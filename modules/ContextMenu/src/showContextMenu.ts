import {popoverController} from "@ionic/core/components";
import {defineCustomElement} from "@ionic/core/components/ion-popover";
import {defineCustomElement as defineBackdrop} from "@ionic/core/components/ion-backdrop";
import {ContextMenuItem} from "./ContextMenuItem";
import {ShowContextMenuOptions} from "./ShowContextMenuOptions";

defineCustomElement();
defineBackdrop();

export async function showContextMenu(target: HTMLElement | Event, items: ContextMenuItem[], options?: ShowContextMenuOptions) {

    const popover = await popoverController.create({
        ...(options ?? {}),
        component: "ionx-context-menu",
        componentProps: {items: items.filter(item => !!item)},
        event: target instanceof HTMLElement ? {target} as any : target,
        backdropDismiss: true
    });

    await popover.present();

    popover.animated = false;

}
