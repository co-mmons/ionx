import {modalController, ModalOptions} from "@ionic/core";
import {DialogOptions} from "./DialogOptions";

export async function showDialog(options: DialogOptions & Exclude<Partial<ModalOptions>, "component" | "componentProps">) {

    const modal = await modalController.create(Object.assign({}, options, {
        component: "ionx-dialog",
        componentProps: options
    } as ModalOptions));

    modal.style.setProperty("--width", options.width || "300px");
    modal.style.setProperty("--height", "auto");
    modal.style.setProperty("--max-width", "90vw");
    modal.style.setProperty("--max-height", "90vh");
    modal.style.setProperty("--border-radius", "var(--ionx-border-radius)");

    if (!document.querySelector("html.ios")) {
        modal.style.setProperty("--box-shadow", "0px 28px 48px rgba(0, 0, 0, 0.4)");
    }

    await modal.present();

    return modal.querySelector("ionx-dialog");
}
