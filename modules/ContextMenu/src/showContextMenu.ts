import {popoverController} from "@ionic/core";
import {ContextMenuItem} from "./ContextMenuItem";
import {ShowContextMenuOptions} from "./ShowContextMenuOptions";

export async function showContextMenu(target: HTMLElement | Event, items: ContextMenuItem[], options?: ShowContextMenuOptions) {

    const popover = await popoverController.create({
        ...(options ?? {}),
        component: "ionx-context-menu",
        componentProps: {items: items.filter(item => !!item)},
        event: target instanceof HTMLElement ? {target} as any : target
    });

    await popover.present();
    popover.animated = false;

}
