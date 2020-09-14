import {ComponentInterface} from "@stencil/core";
import {Observable, Subject} from "rxjs";
import {FormControl} from "./FormControl";
import {FormControlBindOptions} from "./FormControlBindOptions";
import {FormControlElement} from "./FormControlElement";
import {FormControlImpl} from "./FormControlImpl";
import {FormState} from "./FormState";

export interface FormOptions {
    owner?: ComponentInterface;

}

export class FormController {

    constructor(controls?: {[name: string]: any} | string[], _options?: FormOptions) {
        this.controls = {};

        for (const controlName of (Array.isArray(controls) ? controls : Object.keys(controls))) {
            this.controls[controlName] = new FormControlImpl(controlName);
        }
    }

    state: FormState;

    readonly controls: {[name: string]: FormControl} = {};

    readonly accessors: {[name: string]: HTMLElement & FormControlElement} = {};

    private destroyed = false;

    controlList() {
        return Object.values(this.controls);
    }

    controlNames() {
        return Object.keys(this.controls);
    }

    addControl(name: string, _value?: any) {
        this.controls[name] = null;
    }

    removeControl(name: string) {
        const control = this.controls[name];
        if (control) {
            (control as FormControlImpl).destroy();
            delete this.controls[name];
        }
    }

    bind(el: HTMLElement, name: string, options?: FormControlBindOptions): void;

    bind(name: string, options?: FormControlBindOptions): (el: HTMLElement) => void;

    bind(elOrName: HTMLElement | string, nameOrOptions?: string | FormControlBindOptions, options?: FormControlBindOptions) {
        const form = this;

        if (typeof elOrName === "string") {
            return (el: HTMLElement) => form.bindImpl(el, elOrName, nameOrOptions as FormControlBindOptions);
        } else if (elOrName instanceof HTMLElement) {
            this.bindImpl(elOrName, name, options);
        }
    }

    private bindImpl(el: HTMLElement, name: string, options?: FormControlBindOptions) {

        if (!el) {
            (this.controls[name] as FormControlImpl)?.detach();
            return;
        }

        const control = this.controls[name] ? this.controls[name] as FormControlImpl : new FormControlImpl(name);
        control.attach(el);

        if (options && "validators" in options) {
            control.setValidators(...(Array.isArray(options.validators) ? options.validators : [options.validators]));
        }

        control.statusChanges.subscribe(() => this.buildState());
    }

    readonly stateChanged: Observable<FormState> = new Subject();

    protected buildState() {
        // const current = this.state;
    }

    async validate(): Promise<boolean> {

        for (const control of this.controlList()) {
            if (!(await control.validate())) {
                return false;
            }
        }

        return true;
    }

    isDestroyed() {
        return this.destroyed;
    }

    /**
     * Cleanups all the referencies to controls and closes subscribers.
     */
    destroy() {
        (this.stateChanged as Subject<any>).complete();
        this.destroyed = true;
    }
}
