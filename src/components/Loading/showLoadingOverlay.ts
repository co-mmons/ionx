import {popoverController} from "@ionic/core";
import {LoadingOptions} from "./LoadingOptions";

export async function showLoadingOverlay(options: LoadingOptions) {

    const popover = await popoverController.create({
        animated: false,
        cssClass: "ionx-popover-flex",
        showBackdrop: typeof options?.backdropVisible === "boolean" ? options.backdropVisible : true,
        backdropDismiss: false,
        keyboardClose: false,
        component: "ionx-loading",
        componentProps: Object.assign({type: "spinner"} as LoadingOptions, options, {backdropVisible: false})
    });

    const wrapper = popover.querySelector<HTMLElement>(".popover-content");
    wrapper.style.padding = "16px";

    await popover.present();

    return popover.querySelector("ionx-loading");
}
