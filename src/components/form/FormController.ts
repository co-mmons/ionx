import {ComponentInterface} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {FormControl} from "./FormControl";
import {FormControlBindOptions} from "./FormControlBindOptions";
import {FormControlImpl} from "./FormControlImpl";
import {FormState} from "./FormState";

export interface FormControllerOptions {
    owner?: ComponentInterface;
}

/**
 *
 */
export class FormController {

    constructor(controls?: {[name: string]: any} | string[], _options?: FormControllerOptions) {
        this.controls = {};

        for (const controlName of (Array.isArray(controls) ? controls : Object.keys(controls))) {
            this.addControl(controlName);
        }
    }

    readonly controls: {[name: string]: FormControl} = {};

    private destroyed = false;

    controlList() {
        return Object.values(this.controls);
    }

    controlNames() {
        return Object.keys(this.controls);
    }

    addControl(name: string, _value?: any) {
        this.controls[name] = new FormControlImpl(name);
        this.fireStateChange();
    }

    removeControl(name: string) {
        const control = this.controls[name];
        if (control) {
            (control as FormControlImpl).destroy();
            delete this.controls[name];
            this.fireStateChange();
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

        if (control.element === el) {
            return;
        }

        control.attach(el);

        if (options && "validators" in options) {
            control.setValidators(...(Array.isArray(options.validators) ? options.validators : [options.validators]));
        }

        control.statusChanges.subscribe(() => this.fireStateChange());
        control.valueChanges.subscribe(() => this.fireStateChange());

        this.fireStateChange();
    }

    readonly stateChanged: Observable<FormState> = new BehaviorSubject(this.state());

    state(): FormState {

        const state = {
            controls: {},
            dirty: false,
            pristine: true,
            touched: false,
            untouched: true,
            valid: true,
            invalid: false
        };

        for (const control of this.controlList()) {
            const s = control.state();

            state.controls[control.name] = s;

            if (s.dirty) {
                state.dirty = true;
                state.pristine = false;
            }

            if (s.touched) {
                state.touched = true;
                state.untouched = false;
            }

            if (!s.valid) {
                state.valid = false;
                state.invalid = true;
            }
        }

        return state as FormState;
    }

    private fireStateChange() {
        const subject = this.stateChanged as BehaviorSubject<FormState>;

        const previous = subject.getValue();
        const current = this.state();

        if (!deepEqual(previous, current)) {
            subject.next(current);
        }
    }

    async validate(options?: {preventScroll?: boolean, preventFocus?: boolean}): Promise<boolean> {

        for (const control of this.controlList()) {
            if (!(await control.validate())) {

                if (!options?.preventFocus) {
                    control.focus({preventScroll: options?.preventScroll});
                }

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
