import {ComponentInterface} from "@stencil/core";
import {Observable, Subject} from "rxjs";
import {FormControl} from "./FormControl";
import {FormControlValueAccessor} from "./FormControlValueAccessor";
import {FormState} from "./FormState";

export interface FormControls {
    [name: string]: any;
}

export interface FormOptions {
    component?: ComponentInterface;
}

export class Form {

    constructor(_controls?: {[name: string]: any} | string[], _options?: FormOptions) {
        this.controls = {};
    }

    state: FormState;

    controls: {[name: string]: FormControl};

    accessors: {[name: string]: HTMLElement & FormControlValueAccessor};

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
            delete this.controls[name];
        }
    }

    bind(el: HTMLElement, name: string): void;

    bind(name: string): (el: HTMLElement) => void;

    bind(elOrName: HTMLElement | string, name?: string) {
        const form = this;

        if (typeof elOrName === "string") {
            return (el: HTMLElement) => form.bindImpl(el, elOrName);
        } else {
            this.bindImpl(elOrName, name);
        }
    }

    private bindImpl(el: HTMLElement, name: string) {

        const previous = this.accessors[name];

        // do nothing, as same element given
        if (previous && previous === el) {
            return;
        }

        // new element, unbind previous
        else if (previous) {

        }

        this.accessors[name] = el as HTMLElement & FormControlValueAccessor;
    }

    readonly stateChanged: Observable<FormState> = new Subject();

    protected buildState() {
        // const current = this.state;
    }
}
