import {ComponentInterface} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {FormControl} from "./FormControl";
import {FormControlAttachOptions} from "./FormControlAttachOptions";
import {FormControlImpl} from "./FormControlImpl";
import {FormControlState} from "./FormControlState";
import {FormState} from "./FormState";
import {FormValidator} from "./FormValidator";

export interface FormControllerOptions {
    owner?: ComponentInterface;
    onStateChange?: (state: FormState) => void;
}

/**
 *
 */
export class FormController<Controls extends {[name: string]: {value?: any, validators?: FormValidator[]}}> {

    constructor(controls?: Controls, options?: FormControllerOptions) {

        if (options?.onStateChange) {
            this.onStateChange(options.onStateChange);
        }

        if (controls) {
            for (const controlName of (Array.isArray(controls) ? controls : Object.keys(controls))) {
                this.add(controlName, (!Array.isArray(controls) && controls[controlName]) || undefined);
            }
        }
    }

    readonly controls: {[controlName: string]: FormControl<any>}  & {
        [controlName in keyof Controls]: FormControl<Controls[controlName]["value"]>}= {} as any;

    private stateChanged = new BehaviorSubject(this.state());

    private destroyed = false;

    private bindHosts: Array<[any, {[controlName: string]: string}]> = [];

    /**
     * Returns list of controls.
     */
    list(): FormControl<Controls[keyof Controls]["value"] | any>[] {
        return Object.values(this.controls);
    }

    /**
     * Returns names of all controls.
     */
    names(): Array<keyof Controls | string> {
        return Object.keys(this.controls) as any[];
    }

    /**
     * Returns states for all controls.
     */
    states(): {[controlName in keyof Controls]: FormControlState<Controls[controlName]["value"]>} & {[controlName: string]: FormControlState} {
        const states: {[controlName in keyof Controls]: FormControlState} = {} as any;

        for (const control of this.list()) {
            states[control.name as keyof Controls] = (control as FormControlImpl).mutableState();
        }

        return states;
    }

    add(controlName: string, options?: {value?: any, validators?: FormValidator[]}) {

        const exists = !!this.controls[controlName];

        if (!this.controls[controlName]) {
            // @ts-ignore
            this.controls[controlName] = new FormControlImpl(controlName);
        }

        if (options?.validators) {
            this.controls[controlName].setValidators(...options.validators);
        }

        if (options && "value" in options) {
            this.controls[controlName].setValue(options.value);
        } else if (!exists) {
            this.fireStateChange();
        }
    }

    remove(controlName: (keyof Controls) | string) {
        const control = this.controls[controlName];
        if (control) {
            (control as any as FormControlImpl).destroy();
            delete this.controls[controlName];
            this.fireStateChange();
        }
    }

    attach(el: HTMLElement, name: (keyof Controls) | string, options?: FormControlAttachOptions): void;

    attach(name: (keyof Controls) | string, options?: FormControlAttachOptions): (el: HTMLElement) => void;

    attach(elOrName: HTMLElement | ((keyof Controls) | string), nameOrOptions?: ((keyof Controls) | string) | FormControlAttachOptions, options?: FormControlAttachOptions) {
        const form = this;

        if (typeof elOrName === "string") {
            return (el: HTMLElement) => form.attachImpl(el, elOrName, nameOrOptions as FormControlAttachOptions);
        } else if (elOrName instanceof HTMLElement) {
            this.attachImpl(elOrName, name, options);
        }
    }

    private attachImpl(el: HTMLElement, name: string, options?: FormControlAttachOptions) {

        if (!el) {
            (this.controls[name] as FormControlImpl)?.detach();
            return;
        }

        // @ts-ignore
        const control = this.controls[name] ? this.controls[name] as FormControlImpl : (this.controls[name] = new FormControlImpl(name));

        if (control.element === el) {
            return;
        }

        control.attach(el);

        if (options && "validators" in options) {
            control.setValidators(...(Array.isArray(options.validators) ? options.validators : [options.validators]));
        }

        control.onStateChange(() => this.fireStateChange());

        this.fireStateChange();
    }

    onStateChange(observer: (state: FormState) => void): Subscription {
        return this.stateChanged.subscribe((state) => observer(state));
    }

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

        for (const control of Object.values(this.controls)) {
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

    setStates(states: {[controlName: string]: FormControlState}) {

        let anyChange = false;

        for (const controlName in states) {
            if (this.controls[controlName]) {
                const {statusChange, valueChange} = (this.controls[controlName] as FormControlImpl).setState(states[controlName], {preventEvent: true});
                if (statusChange || valueChange) {
                    anyChange = true;
                }
            }
        }

        if (anyChange) {
            this.fireStateChange(false);
        }
    }

    private fireStateChange(checkForChange = true) {
        const previous = this.stateChanged.getValue();
        const current = this.state();
        // console.log(checkForChange, deepEqual(previous, current), current, previous);
        if (!checkForChange || (checkForChange && !deepEqual(previous, current))) {
            this.runBindHost(current);
            this.stateChanged.next(current);
        }
    }

    private runBindHost(state: FormState) {

        if (this.bindHosts.length > 0) {

            let all: {[controlName: string]: undefined};

            for (const host of this.bindHosts) {

                if (!host[1] && !all) {
                    all = Object.assign({}, ...(Object.keys(this.controls).map(controlName => ({[controlName]: undefined}))));
                }

                for (const controlName in (host[1] || all)) {

                    try {
                        host[0][(host[1] && host[1][controlName]) || controlName] = state.controls[controlName] && state.controls[controlName];

                    } catch (error) {
                        console.warn(`[ionx-form-controller] error when binding control states to host`, host, error);
                    }
                }
            }
        }
    }

    async validate(options?: {preventScroll?: boolean, preventFocus?: boolean}): Promise<boolean> {

        for (const control of this.list()) {
            if (!(await control.validate())) {

                if (!options?.preventFocus) {
                    control.focus({preventScroll: options?.preventScroll});
                }

                return false;
            }
        }

        return true;
    }

    /**
     * Binds control
     * @param host
     * @param controls
     */
    bindStates(host: any, controls?: string[] | {[controlName: string]: string}) {

        let bindRecord: [any, {[controlName: string]: string}];

        // host already binded
        for (const existing of this.bindHosts) {
            if (existing[0] === host) {
                bindRecord = existing;
                return;
            }
        }

        if (!bindRecord) {
            bindRecord = [host, undefined];
            this.bindHosts.push(bindRecord);
        }

        if (!controls) {
            bindRecord[1] = undefined;
        } else if (Array.isArray(controls)) {
            bindRecord[1] = controls.length > 0 ? Object.assign({}, ...(controls.map(controlName => ({[controlName]: undefined})))) : undefined;
        } else {
            bindRecord[1] = Object.keys(controls).length > 0 ? controls : undefined;
        }
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
