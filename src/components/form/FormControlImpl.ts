import {Observable, Subject} from "rxjs";
import {addEventListener, EventUnlisten} from "../dom";
import {FormControl} from "./FormControl";
import {FormControlElement} from "./FormControlElement";
import {FormStatus} from "./FormStatus";
import {FormValidationError} from "./FormValidationError";
import {FormValidator} from "./FormValidator";

export class FormControlImpl<Value = any> implements FormControl<Value> {

    constructor(public readonly name: string) {
    }

    private element$: HTMLElement & Partial<FormControlElement>;

    private touched$ = false;

    private dirty$ = false;

    private disabled$ = false;

    private value$: Value;

    private unlistenOnChange: EventUnlisten;

    private unlistenOnFocus: EventUnlisten;

    private validators$: FormValidator[];

    private error$: FormValidationError;

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
        return !!this.error$;
    }

    get invalid() {
        return !this.error$;
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

    readonly valueChanges: Observable<Value> = new Subject();

    readonly statusChanges: Observable<{current: FormStatus, previous: FormStatus}> = new Subject();


    private setStatus(what: "touched" | "dirty" | "disabled" | "valid", not = false) {
        console.debug(`[ionx-form-control] set status ${what} as ${!not}`);

        const status = this.status();
        const was = status[what];

        const item = this.element$.closest("ion-item");
        const formItem = this.element$.closest("ionx-form-item");

        const classes = [];

        if (what !== "disabled") {
            classes.push(`ion-${what}`);

            if (what === "touched") {
                classes.push("ion-untouched");
            } else if (what === "dirty") {
                classes.push("ion-pristine");
            } else if (what === "valid") {
                classes.push("ion-invalid");
            }
        }

        if (not) {
            classes.reverse()
        }

        if (classes.length > 0) {
            for (const el of [this.element$, item, formItem]) {
                if (el) {
                    el.classList.add(classes[0]);
                    el.classList.remove(classes[1]);
                }
            }
        }

        if (was !== !not) {
            this.fireStatusChange(status);
        }
    }

    markAsDirty() {
        this.setStatus("dirty");
    }

    markAsTouched() {
        this.setStatus("touched");
    }

    markAsUntouched() {
        this.setStatus("touched", true);
    }

    markAsPristine() {
        this.setStatus("dirty", true);
    }

    setValidators(...validators: FormValidator[]) {
        this.validators$ = validators;
    }

    getValidators() {
        return this.validators$.slice();
    }

    clearValidators() {
        this.validators$ = undefined;
    }

    enable() {

    }

    disable() {

    }

    setValue(value: Value) {

        if (!this.element$) {
            throw new Error("Form control not initialized, missing HTMLElement");
        }

        const tagName = this.element$.tagName.toLowerCase();

        if (tagName === "ion-input" || tagName === "ion-select" || tagName === "ion-textarea") {
            (this.element$ as HTMLIonInputElement | HTMLIonSelectElement | HTMLIonTextareaElement).value = value as any;
        } else if (tagName === "ion-checkbox") {
            (this.element$ as HTMLIonCheckboxElement).checked = !!value;
        } else if (this.element$.applyFormValue) {
            this.element$.applyFormValue(value);
        }
    }

    async validateImpl(options: {trigger: "valueChange" | "validate"}): Promise<boolean> {

        let error: FormValidationError;

        if (this.validators$) {
            VALIDATORS: for (const validator of this.validators$) {
                try {
                    const result = validator(this, options);
                    if (result instanceof Promise) {
                        await result;
                    }
                } catch (er) {

                    if (er instanceof FormValidationError) {
                        error = er;
                        break VALIDATORS;

                    } else {
                        console.warn(`[ionx-form-control] unknown error during validation "${this.name}"`, error);
                        return false;
                    }
                }
            }
        }

        if (error) {
            this.error$ = error;
            this.setStatus("valid", true);
            return false;
        } else {
            this.error$ = undefined;
            this.setStatus("valid");
            return true;
        }
    }

    async validate(): Promise<boolean> {
        return this.validateImpl({trigger: "validate"});
    }

    attach(element: HTMLElement) {

        if (this.element$ !== element) {

            if (this.element$) {
                this.detach();
            }

            this.element$ = element;

            this.unlistenOnChange = addEventListener(this.element$, this.element$.formValueChangeEventName || "ionChange", ev => this.onChange(ev as CustomEvent));

            this.unlistenOnFocus = addEventListener(this.element$, this.element$.formTouchEventName || "ionFocus", () => this.markAsTouched());

            this.applyStatus();
        }

    }

    detach() {
        if (this.element$) {
            console.debug(`[ionx-form] detach control "${this.name}"`);

            this.unlistenOnChange?.();
            this.unlistenOnChange = undefined;

            this.unlistenOnFocus?.();
            this.unlistenOnFocus = undefined;
        }
    }

    private onChange(ev: CustomEvent) {

        // const previous = this.value$;
        this.value$ = ev.detail?.value;

        this.markAsDirty();
        (this.valueChanges as Subject<Value>).next(this.value$);
        this.validateImpl({trigger: "valueChange"});
    }

    status(): FormStatus {
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

    private applyStatus(current?: FormStatus) {

        if (!current) {
            current = this.status();
        }

        if (this.element$?.applyFormStatus) {

            try {
                this.element$.applyFormStatus(current);
            } catch (error) {
                console.warn(`[ionx-form-control] unhandled error`, error);
            }

        } else if (this.element$) {
            this.element$["disabled"] = current.disabled;
        }
    }

    private fireStatusChange(previous: FormStatus) {
        const current = this.status();

        this.applyStatus(current);

        if (JSON.stringify(previous) !== JSON.stringify(current)) {
            (this.statusChanges as Subject<any>).next({current, previous});
        }
    }

    destroy() {
        this.detach();
        (this.valueChanges as Subject<any>).complete();
        (this.statusChanges as Subject<any>).complete();
    }

}
