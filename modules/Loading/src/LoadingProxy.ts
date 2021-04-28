import {LoadingOptions} from "./LoadingOptions";

export class LoadingProxy implements LoadingOptions {

    constructor(private element: HTMLElement | HTMLIonxLoadingElement) {
        this.loading = element.tagName === "IONX-LOADING" ? element as HTMLIonxLoadingElement : undefined;
    }

    private readonly loading: HTMLIonxLoadingElement;

    async dismiss() {

        if (this.loading) {
            return this.loading.dismiss();
        } else {

            if (this.element.style.opacity === "0" || this.element.style.opacity.startsWith("-")) {
                this.element.remove();
            } else {
                this.element.style.opacity = `${parseFloat(this.element.style.opacity || "1.0") - .1}`;
                requestAnimationFrame(() => this.dismiss());
            }
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
