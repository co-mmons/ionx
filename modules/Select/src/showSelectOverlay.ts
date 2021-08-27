import {modalController, OverlayEventDetail, popoverController} from "@ionic/core";
import {SelectOverlayProps} from "./SelectOverlayProps";
import {SelectValueItem} from "./SelectValueItem";

export async function showSelectOverlay<T = any>(overlay: SelectOverlayProps, event?: Event) {

    let willDismiss: Promise<OverlayEventDetail<{values: T[], items: SelectValueItem[]}>>;
    let didDismiss: Promise<OverlayEventDetail<{values: T[], items: SelectValueItem[]}>>;

    if (overlay.overlay === "popover") {
        const popover = await popoverController.create({component: "ionx-select-overlay", componentProps: overlay, event});
        popover.present();

        willDismiss = popover.onWillDismiss();
        didDismiss = popover.onDidDismiss();

    } else {
        const modal = await modalController.create({component: "ionx-select-overlay", componentProps: overlay});
        modal.present();

        willDismiss = modal.onWillDismiss();
        didDismiss = modal.onDidDismiss();
    }

    return {willDismiss, didDismiss};
}
