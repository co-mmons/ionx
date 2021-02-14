import {waitTill} from "@co.mmons/js-utils/core";
import {deepEqual} from "fast-equals";
import {Observable, Subject} from "rxjs";
import scrollIntoView from "scroll-into-view";
import {addEventListener, EventUnlisten} from "../misc";
import {FormControl} from "./FormControl";
import {FormControlElement} from "./FormControlElement";
import {FormControlReadonlyState, FormControlState} from "./FormControlState";
import {FormControlReadonlyStatus} from "./FormControlStatus";
import {FormValidator} from "./FormValidator";

interface ApplyState<Value = any> {
    touched?: boolean;
    dirty?: boolean;
    disabled?: boolean;
    valid?: boolean;
    value?: Value;
}

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

    get stateChanges(): Observable<{current: FormControlReadonlyState<Value>, previous: FormControlReadonlyState<Value>}> {
        return this.stateChanges$;
    }

    onStateChange(observer: (event: {current: FormControlReadonlyState<Value>, previous: FormControlReadonlyState<Value>}) => void) {
        return this.stateChanges$.subscribe(change => observer(change));
    }

    async focus(options?: FocusOptions & {waitForElement?: boolean | number}) {

        if (!this.element$ && (options?.waitForElement === true || (typeof options?.waitForElement === "number" && options.waitForElement > 0))) {
            try {
                await waitTill(() => !!this.element$, undefined, typeof options.waitForElement === "number" ? options.waitForElement : 1000);
            } catch {
            }
        }

        if (this.element$) {

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
            disabled: this.disabled,
            enabled: this.enabled,
            invalid: this.invalid,
            pristine: this.pristine,
            touched: this.touched,
            untouched: this.untouched,
            valid: this.valid,
            error: this.error$
        }
    }

    state(): FormControlReadonlyState {
        return this.mutableState();
    }


    //
    // ------------ INTERNAL API -----------
    //

    mutableState(): FormControlState {
        return Object.assign({value: this.value}, this.status());
    }

    attach(element: HTMLElement) {

        if (this.element$ !== element) {

            if (this.element$) {
                this.detach();
            }

            this.element$ = element;
            this.element$.setAttribute("ionx-form-control", this.name);

            this.unlistenOnChange = addEventListener(this.element$, this.element$.formValueChangeEventName || "ionChange", ev => this.onElementChange(ev as CustomEvent));

            this.unlistenOnFocus = addEventListener(this.element$, this.element$.formTouchEventName || "ionFocus", () => this.markAsTouched());

            this.applyElementState({value: this.value$, valueChange: true, status: this.status(), statusChange: true});
        }

    }

    detach() {
        if (this.element$) {
            console.debug(`[ionx-form] detach control "${this.name}"`);

            this.unlistenOnChange?.();
            this.unlistenOnChange = undefined;

            this.unlistenOnFocus?.();
            this.unlistenOnFocus = undefined;

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

        this.validated$ = true;

        let error: Error;

        if (this.validators$) {
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

        if (error) {
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

    private unlistenOnChange: EventUnlisten;

    private unlistenOnFocus: EventUnlisten;

    private validators$: FormValidator[];

    private touched$ = false;

    private dirty$ = false;

    private disabled$ = false;

    private valid$ = true;

    private value$: Value;

    private error$: Error;

    private validated$: boolean;

    private stateChanges$ = new Subject<{current: FormControlReadonlyState<Value>, previous: FormControlReadonlyState<Value>}>();

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

        return {valueChange: valueChange, statusChange: statusChange};
    }

    private onElementChange(ev: CustomEvent) {

        if (ev.target !== this.element$) {
            return;
        }

        const value = "checked" in ev.detail ? ev.detail.checked : ev.detail.value;

        this.applyState({dirty: true, value}, {trigger: "elementValueChange"});
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
                    this.element$["disabled"] = state.status.disabled;
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
