import {popoverController} from "@ionic/core";
import {LoadingOptions} from "./LoadingOptions";

export class LoadingOverlayProxy implements LoadingOptions {

    constructor(private element: HTMLElement | HTMLIonxLoadingElement) {
        this.loading = element.tagName === "IONX-LOADING" ? element as HTMLIonxLoadingElement : undefined;
    }

    private readonly loading: HTMLIonxLoadingElement;

    async dismiss() {

        if (this.loading) {
            return this.loading.dismiss();
        } else {
            this.element.remove();
        }
    }

    get backdropVisible() {
        if (this.loading) {
            return this.loading.backdropVisible;
        } else {
            return true;
        }
    }

    set backdropVisible(visible: boolean) {
        if (this.loading) {
            this.loading.backdropVisible = visible;
        }
    }

    get header() {
        if (this.loading) {
            return this.loading.header;
        } else {
            return undefined;
        }
    }

    set header(header: string) {
        if (this.loading) {
            this.loading.header = header;
        }
    }

    get message() {
        if (this.loading) {
            return this.loading.message;
        } else {
        }
    }

    set message(message: string) {
        if (this.loading) {
            this.loading.message = message;
        } else {

        }
    }

    get progressBuffer() {
        if (this.loading) {
            return this.loading.progressBuffer;
        }
    }

    set progressBuffer(buffer: number) {
        if (this.loading) {
            this.loading.progressBuffer = buffer;
        }
    }

    get progressMessage() {
        if (this.loading) {
            return this.loading.progressMessage;
        }
    }

    set progressMessage(message: string) {
        if (this.loading) {
            this.loading.progressMessage = message;
        }
    }

    get progressPercent() {
        if (this.loading) {
            return this.loading.progressPercent;
        }
    }

    set progressPercent(progress: number) {
        if (this.loading) {
            this.loading.progressPercent = progress;
        }
    }

    get progressType() {
        if (this.loading) {
            return this.loading.progressType;
        }
    }

    set progressType(type) {
        if (this.loading) {
            this.loading.progressType = type;
        }
    }

    get progressValue() {
        if (this.loading) {
            return this.loading.progressValue;
        }
    }

    set progressValue(value) {
        if (this.loading) {
            this.loading.progressValue = value;
        }
    }

    get type() {
        if (this.loading) {
            return this.loading.type;
        }
    }

    set type(type) {
        if (this.loading) {
            this.loading.type = type;
        }
    }
}

export async function showLoadingOverlay(options: LoadingOptions) {

    if (options.type === "spinner") {

        const app = document.querySelector("ion-app");

        const overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.left = "0";
        overlay.style.top = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, .3)";
        overlay.style.zIndex = "19999";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";

        app.appendChild(overlay);

        const spinner = document.createElement("ion-spinner");
        spinner.style.color = "#fff";
        overlay.appendChild(spinner);

        return new LoadingOverlayProxy(overlay);

    } else {

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

        return new LoadingOverlayProxy(popover.querySelector("ionx-loading"));
    }
}
