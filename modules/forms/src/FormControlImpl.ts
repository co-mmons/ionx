import {waitTill} from "@co.mmons/js-utils/core";
import {deepEqual} from "fast-equals";
import {addEventListener, EventUnlisten, isHydrated} from "ionx/utils";
import {Observable, Subject} from "rxjs";
import scrollIntoView from "scroll-into-view";
import {FormControl} from "./FormControl";
import {FormControlElement} from "./FormControlElement";
import {FormControlReadonlyState, FormControlState} from "./FormControlState";
import {FormControlStateChange} from "./FormControlStateChange";
import {FormControlReadonlyStatus} from "./FormControlStatus";
import {FormValidator} from "./FormValidator";
import {loadIntlMessages} from "./intl/loadIntlMessages";

interface ApplyState<Value = any> {
    touched?: boolean;
    dirty?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    valid?: boolean;
    value?: Value;
}

const detachFunctionName = "__ionxFormControlDetach";

export class FormControlImpl<Value = any> implements FormControl<Value> {

    constructor(public readonly name: string) {
    }


    //
    // ------------ INTERFACE API -----------
    //

    get touched() {
        return this.touched$;
    }

    get untouched() {
        return !this.touched$;
    }

    get dirty() {
        return this.dirty$;
    }

    get pristine() {
        return !this.dirty$;
    }

    get enabled() {
        return !this.disabled$;
    }

    get disabled() {
        return this.disabled$;
    }

    get readonly() {
        return !!this.readonly$;
    }

    get mutable() {
        return !this.readonly$;
    }

    get valid() {
        return this.valid$;
    }

    get invalid() {
        return !this.valid$;
    }

    get value() {
        return this.value$;
    }

    get element() {
        return this.element$;
    }

    get error() {
        return this.error$;
    }

    get stateChanges(): Observable<FormControlStateChange<Value>> {
        return this.stateChanges$;
    }

    onStateChange(observer: (event: FormControlStateChange<Value>) => void) {
        return this.stateChanges$.subscribe(change => observer(change));
    }

    async focus(options?: FocusOptions & {waitForElement?: boolean | number}) {

        if (!this.element$ && (options?.waitForElement === true || (typeof options?.waitForElement === "number" && options.waitForElement > 0))) {
            try {
                await waitTill(() => !!this.element$ && isHydrated(this.element$),  undefined, typeof options.waitForElement === "number" ? options.waitForElement : 1000);
            } catch {
            }
        }

        if (this.element$) {

            // fix for ion-onput, as setFocus do not waits for native input to be loaded
            if (this.element$.tagName === "ION-INPUT") {
                await this.element$["getInputElement"]();
            }

            if (this.element$.setFocus) {
                await this.element$.setFocus(options);

            } else if (this.element$.tagName.startsWith("ION-") || this.element$.tagName.startsWith("IONX-")) {
                if (!options?.preventScroll) {
                    scrollIntoView(this.element$.closest("ion-item") || this.element$);
                }

            } else {
                this.element$.focus(options);
            }
        }
    }

    markAsDirty() {
        this.applyState({dirty: true});
    }

    markAsTouched() {
        this.applyState({touched: true});
    }

    markAsUntouched() {
        this.applyState({touched: false});
    }

    markAsPristine() {
        this.applyState({dirty: false});
    }

    markAsReadonly() {
        this.applyState({readonly: true});
    }

    markAsMutable() {
        this.applyState({readonly: false});
    }

    setValidators(validators: FormValidator | FormValidator[]) {
        this.validators$ = Array.isArray(validators) ? validators.slice() : (validators ? [validators] : []);
    }

    getValidators() {
        return this.validators$.slice();
    }

    clearValidators() {
        this.validators$ = undefined;
    }

    enable() {
        this.applyState({disabled: false});
    }

    disable() {
        this.applyState({disabled: true});
    }

    setValue(value: Value, options?: {dirty?: boolean, touched?: boolean}) {

        const state: Partial<FormControlState> = {value: value};

        if (typeof options?.dirty === "boolean") {
            state.dirty = options.dirty;
        } else if (typeof options?.touched === "boolean") {
            state.dirty = options.touched;
        }

        this.applyState(state);
        this.validateImpl({trigger: "valueChange"});
    }

    async validate(): Promise<boolean> {
        return this.validateImpl({trigger: "validate"});
    }

    status(): FormControlReadonlyStatus {
        return {
            dirty: this.dirty,
            disabled: this.disabled$,
            enabled: this.enabled,
            invalid: this.invalid,
            pristine: this.pristine,
            touched: this.touched,
            untouched: this.untouched,
            readonly: this.readonly$,
            mutable: !this.readonly$,
            valid: this.valid,
            error: this.error$
        }
    }

    state(): FormControlReadonlyState {
        return this.mutableState();
    }

    attach(): (element: HTMLElement) => void {

        const detachFunctionName = "__ionxFormControlDetach"

        const control = this;
        const func = function (el: HTMLElement) {

            if (!el) {
                this[detachFunctionName]?.();

            } else {

                // do nothing, as nothing really changed
                if (el[detachFunctionName] === this[detachFunctionName] && el === control.element$) {
                    return;
                }

                // detach previously attached element
                if (el !== control.element$ && control.element$) {
                    control.detach();
                }

                // detach function if given element was already attached somewhere
                el[detachFunctionName]?.(control);

                // define detach function
                // returns true if control was detached or false if it wasn't needed
                this[detachFunctionName] = el[detachFunctionName] = (newControl?: FormControl) => {

                    if (control !== newControl && el[detachFunctionName] === this[detachFunctionName]) {
                        control.detach();
                    }

                    delete this[detachFunctionName];
                }

                if (control.element$ !== el) {
                    console.debug(`[ionx-form-control] attach control ${control.name}`, el);

                    control.element$ = el;
                    control.element$.setAttribute("ionx-form-control", control.name);

                    if (el.tagName.startsWith("APPX-")) {
                        control.unlisteners.push(
                            addEventListener(control.element$, control.element$.formValueChangeEventName || "valuechange", ev => control.onElementChange(ev as CustomEvent)),
                            addEventListener(control.element$, control.element$.formTouchEventName || "focus", () => control.markAsTouched()));
                    } else {

                        if (el.tagName.startsWith("APP-")) {
                            control.unlisteners.push(
                                addEventListener(control.element$, control.element$.formValueChangeEventName || "valuechange", ev => control.onElementChange(ev as CustomEvent)),
                                addEventListener(control.element$, control.element$.formTouchEventName || "focus", () => control.markAsTouched()));
                        }

                        control.unlisteners.push(
                            addEventListener(control.element$, control.element$.formValueChangeEventName || "ionChange", ev => control.onElementChange(ev as CustomEvent)),
                            addEventListener(control.element$, control.element$.formTouchEventName || "ionFocus", () => control.markAsTouched()));
                    }

                    control.applyElementState({value: control.value$, valueChange: true, status: control.status(), statusChange: true});
                }
            }
        }

        return func.bind(func);
    }


    //
    // ------------ INTERNAL API -----------
    //

    mutableState(): FormControlState {
        return Object.assign({value: this.value}, this.status());
    }

    detach() {
        if (this.element$) {
            console.debug(`[ionx-form-control] detach control ${this.name}`, this.element$);

            for (const u of this.unlisteners.splice(0)) {
                u();
            }

            delete this.element$[detachFunctionName];

            this.element$.removeAttribute("ionx-form-control");
            this.element$ = undefined;
        }
    }

    /**
     * Doesn't fire change observers.
     */
    setState(state: FormControlState, options?: {preventEvent: boolean}) {
        return this.applyState(state, options);
    }

    async validateImpl(options: {trigger: "valueChange" | "validate"}): Promise<boolean> {

        await loadIntlMessages();

        this.validated$ = true;

        let error: Error;

        if (!error && this.validators$) {
            VALIDATORS: for (const validator of this.validators$) {
                try {
                    const result = validator(this, options);
                    if (result instanceof Promise) {
                        await result;
                    }
                } catch (er) {
                    error = er instanceof Error ? er : new Error(er);
                    break VALIDATORS;
                }
            }
        }

        if (!error) {
            try {
                this.element$?.formValidate?.();
            } catch (er) {
                error = er instanceof Error ? er : new Error(er);
            }
        }

        if (error && (this.dirty || options.trigger !== "valueChange")) {
            this.error$ = error;
            this.applyState({valid: false});
            return false;
        } else {
            this.error$ = undefined;
            this.applyState({valid: true});
            return true;
        }
    }


    //
    // ------------ PRIVATE API -----------
    //

    private element$: HTMLElement & Partial<FormControlElement>;

    private unlisteners: EventUnlisten[] = [];

    private validators$: FormValidator[];

    private touched$ = false;

    private dirty$ = false;

    private valid$ = true;

    private value$: Value;

    private error$: Error;

    private validated$: boolean;

    private disabled$: boolean;

    private readonly$: boolean;

    private stateChanges$ = new Subject<FormControlStateChange<Value>>();

    private applyState(state: ApplyState, options?: {preventEvent?: boolean, trigger?: "elementValueChange"}): {valueChange: boolean, statusChange: boolean} {
        console.debug(`[ionx-form-control] apply "${this.name}" state`, state);

        // we need to know status and value before any change
        const status = this.status();
        const value = this.value$;

        let statusChange = false;
        let valueChange = false;

        for (const key in state) {

            if (!deepEqual(state[key], this[key])) {

                if (key === "value") {
                    valueChange = true;
                } else {
                    statusChange = true;
                }

                this[`${key}$`] = state[key];
            }
        }

        const elementValueChange = valueChange && (!options || options.trigger !== "elementValueChange");

        if (elementValueChange || statusChange) {
            this.applyElementState({
                value: elementValueChange ? state.value : value,
                valueChange: elementValueChange,
                status: statusChange ? this.status() : status,
                statusChange
            });
        }

        if ((statusChange || valueChange) && (!options || !options.preventEvent)) {
            this.fireStateChange({status, value});
        }

        return {valueChange: valueChange, statusChange};
    }

    private onElementChange(ev: CustomEvent) {

        if (ev.target !== this.element$) {
            return;
        }

        if (this.disabled || this.readonly) {
            return;
        }

        const value = "checked" in ev.detail ? ev.detail.checked : ev.detail.value;

        const state: ApplyState = {value};
        if (!deepEqual(this.value$, value)) {
            state.dirty = true;
        }

        this.applyState(state, {trigger: "elementValueChange"});
        this.validateImpl({trigger: "valueChange"});
    }

    private applyElementState(state: {value: Value, valueChange: boolean, status: FormControlReadonlyStatus, statusChange: boolean}) {

        // that should be an error?
        if (!state.valueChange && !state.statusChange) {
            console.warn("[ionx-form-control] apply element state only when something changed", new Error());
            return;
        }

        if (this.element$) {

            // sync element's css classes
            if (state.statusChange) {

                const item = this.element$.closest("ion-item");
                const formItem = this.element$.closest("ionx-form-item");
                const formField = this.element$.closest("ionx-form-field");

                for (const key of ["dirty", "touched", "valid"]) {

                    const status = state.status[key];
                    const classes = [];

                    classes.push(`ion-${key}`);

                    if (key === "touched") {
                        classes.push("ion-untouched");
                    } else if (key === "dirty") {
                        classes.push("ion-pristine");
                    } else if (key === "valid") {
                        classes.push("ion-invalid");
                    }

                    if (!status) {
                        classes.reverse();
                    }

                    if (classes.length > 0) {
                        for (const el of [this.element$, item, formItem, formField]) {
                            if (el) {

                                if (key === "valid" && !this.validated$ && !state.status.dirty) {
                                    el.classList.remove(...classes);
                                } else {
                                    el.classList.add(classes[0]);
                                    el.classList.remove(classes[1]);
                                }
                            }
                        }
                    }
                }
            }

            const tagName = this.element$.tagName.toLowerCase();

            if (this.element$.applyFormState) {

                try {
                    this.element$.applyFormState(state);
                } catch (error) {
                    console.warn(`[ionx-form-control] unhandled error`, error);
                }

            } else {

                if (state.valueChange) {
                    if (tagName === "ion-checkbox" || tagName === "ion-toggle") {
                        (this.element$ as HTMLIonCheckboxElement).checked = !!this.value$;
                    } else {
                        this.element$["value"] = this.value$ as any;
                    }
                }

                if (state.statusChange) {

                    if (typeof state.status.disabled === "boolean") {
                        this.element$["disabled"] = state.status.disabled;
                    }

                    if (typeof state.status.readonly === "boolean") {
                        this.element$["readonly"] = state.status.readonly;
                    }
                }
            }
        }
    }

    private fireStateChange(previous: {status?: FormControlReadonlyStatus, value?: Value}) {
        const status = this.status();

        const statusChanged = !!("status" in previous && !deepEqual(previous.status, status));
        const valueChanged = !!("value" in previous && !deepEqual(previous.value, this.value$));

        if (statusChanged || valueChanged) {

            console.debug(`[ionx-form-control] state of "${this.name}" changed: {status: ${statusChanged}, value: ${valueChanged}}`);

            const previousStatus = "status" in previous ? previous.status : status;
            const previousValue = "value" in previous ? previous.value : this.value$;

            (this.stateChanges as Subject<any>).next({
                current: Object.assign({value: this.value$}, status),
                previous: Object.assign({value: previousValue}, previousStatus),
                status: statusChanged,
                value: valueChanged
            });
        }
    }

    disconnect() {
        this.detach();

        this.stateChanges$.complete();
        this.stateChanges$ = new Subject();
    }

}
