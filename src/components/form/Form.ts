import {ComponentInterface} from "@stencil/core";
import {Observable, Subject} from "rxjs";
import {FormControl} from "./FormControl";
import {FormControlElement} from "./FormControlElement";
import {FormControlImpl} from "./FormControlImpl";
import {FormState} from "./FormState";

export interface FormOptions {
    owner?: ComponentInterface;

}

export class Form {

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

    bind(el: HTMLElement, name: string): void;

    bind(name: string): (el: HTMLElement) => void;

    bind(elOrName: HTMLElement | string, name?: string) {
        const form = this;

        if (typeof elOrName === "string") {
            return (el: HTMLElement) => form.bindImpl(el, elOrName);
        } else if (elOrName instanceof HTMLElement) {
            this.bindImpl(elOrName, name);
        }
    }

    private bindImpl(el: HTMLElement, name: string) {

        if (!el) {
            (this.controls[name] as FormControlImpl)?.detach();
            return;
        }

        if (!(name in this.controls)) {
            throw new Error(`Form control "${name}" not exists`);
        }

        (this.controls[name] as FormControlImpl).attach(el);
    }

    readonly stateChanged: Observable<FormState> = new Subject();

    protected buildState() {
        // const current = this.state;
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
