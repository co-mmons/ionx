import {waitTill} from "@co.mmons/js-utils/core";
import {FormControlAttachOptions} from "./FormControlAttachOptions";

export function attachControl(el: HTMLElement, name: string, options?: FormControlAttachOptions): void;

export function attachControl(name: string, options?: FormControlAttachOptions): (el: HTMLElement) => void;

export function attachControl(elOrName: HTMLElement | string, nameOrOptions?: string | FormControlAttachOptions, options?: FormControlAttachOptions) {

    if (elOrName !== null && elOrName !== undefined) {

        if (typeof elOrName === "string") {
            return (el: HTMLElement) => attachControl(el, elOrName, nameOrOptions as FormControlAttachOptions);
        } else if (elOrName instanceof HTMLElement) {
            let form: HTMLIonxFormControllerElement;
            waitTill(() => !!(form = elOrName.closest("ionx-form-controller")), 1, 10000)
                .then(() => form.attach(elOrName, nameOrOptions as string, options))
                .catch(e => console.error("Not able to attach control to form, no ionx-form-controller found", elOrName, e))
        }
    }
}
