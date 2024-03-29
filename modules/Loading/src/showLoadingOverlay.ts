import {popoverController} from "@ionic/core/components";
import {defineCustomElement as definePopover} from "@ionic/core/components/ion-popover";
import {LoadingOptions} from "./LoadingOptions";
import {LoadingProxy} from "./LoadingProxy";

definePopover();

export async function showLoadingOverlay(options?: LoadingOptions) {

    if (!options?.type) {

        const app = document.querySelector("ion-app");

        const overlay = document.createElement("div");
        overlay.className = "ionx-loading-overlay";
        overlay.style.position = "absolute";
        overlay.style.left = "0";
        overlay.style.top = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = `rgba(${options?.backdropTheme === "light" ? "255,255,255, 0.5" : "0,0,0,.32"})`;
        overlay.style.zIndex = "19999";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";

        app.appendChild(overlay);

        const spinner = document.createElement("ion-spinner");
        spinner.style.color = options?.backdropTheme === "light" ? "#000" : "#fff";
        overlay.appendChild(spinner);

        return new LoadingProxy(overlay);

    } else {

        const popover = await popoverController.create({
            animated: false,
            cssClass: "ionx-loading-popover",
            showBackdrop: typeof options?.backdropVisible === "boolean" ? options.backdropVisible : true,
            backdropDismiss: false,
            keyboardClose: false,
            component: "ionx-loading",
            componentProps: Object.assign({type: "spinner"} as LoadingOptions, options, {backdropVisible: false})
        });

        popover.style.setProperty("--width", "auto");

        const wrapper = popover.shadowRoot.querySelector<HTMLElement>(".popover-wrapper");
        wrapper.style.maxWidth = "90%";

        const content = popover.shadowRoot.querySelector<HTMLElement>(".popover-content");
        content.style.padding = "16px";
        content.style.position = "initial";

        await popover.present();

        return new LoadingProxy(popover.querySelector("ionx-loading"));
    }
}
