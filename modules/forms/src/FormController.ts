import {forceUpdate} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {FormControl} from "./FormControl";
import {FormControlAttachOptions} from "./FormControlAttachOptions";
import {FormControlImpl} from "./FormControlImpl";
import {FormControllerPublicApi, FormControllerValidateOptions} from "./FormControllerPublicApi";
import {FormControlState} from "./FormControlState";
import {FormControlStateChange} from "./FormControlStateChange";
import {FormState} from "./FormState";
import {FormStateChange} from "./FormStateChange";
import {FormValidationErrorPresenter} from "./FormValidationErrorPresenter";
import {FormValidator} from "./FormValidator";

export type FormKnownControls = {[name: string]: {value?: any, validators?: FormValidator[]}};

/**
 *
 */
export class FormController<Controls extends FormKnownControls = any> implements FormControllerPublicApi {

    constructor(controls?: Controls, options?: {errorHandler?: FormValidationErrorPresenter}) {

        if (controls) {
            for (const controlName of (Array.isArray(controls) ? controls : Object.keys(controls))) {
                this.add(controlName, (!Array.isArray(controls) && controls[controlName]) || undefined);
            }
        }

        if (options?.errorHandler) {
            this.errorPresenter$ = options.errorHandler;
        }
    }

    readonly controls: {[controlName: string]: FormControl<any>}  & {
        [controlName in keyof Controls]: FormControl<Controls[controlName]["value"]>}= {} as any;

    private stateChanged = new BehaviorSubject({current: this.state(), previous: null as FormState, value: false, status: false});

    private controlStateChanged = new Subject<{controlName: string} & FormControlStateChange>();

    private bindHosts: Array<[any, {[controlName: string]: string}]> = [];

    private renderer$: {render: () => void};

    private errorPresenter$: FormValidationErrorPresenter;

    private status: Omit<FormState, "controls">;

    get renderer() {
        return this.renderer$;
    }

    set renderer(renderer: {render: () => void}) {
        this.renderer$ = renderer;
    }

    set errorPresenter(presenter: FormValidationErrorPresenter) {
        this.setErrorPresenter(presenter);
    }

    setErrorPresenter(errorHandler: FormValidationErrorPresenter): this {

        if (this.errorPresenter$) {
            this.errorPresenter$.dismiss(this);
        }

        this.errorPresenter$ = errorHandler;

        return this;
    }

    entries(): Array<[name: keyof Controls | string, control: FormControl<Controls[keyof Controls]["value"] | any>]> {
        return Object.entries(this.controls);
    }

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

    has(controlName: string) {
        return !!this.controls[controlName];
    }

    add(controlName: string, options?: {value?: any, validators?: FormValidator[]}) {

        const exists = !!this.controls[controlName];

        if (!this.controls[controlName]) {
            (this.controls[controlName] as any) = new FormControlImpl(controlName);
            this.controls[controlName].onStateChange(ev => {
                this.fireStateChange();
                this.controlStateChanged.next({controlName, ...ev});
            });
        }

        if (options && "value" in options) {
            this.controls[controlName].setValue(options.value);
        } else if (!exists) {
            this.fireStateChange();
        }

        if (options?.validators) {
            this.controls[controlName].setValidators(options.validators);
        }

        return this.controls[controlName];
    }

    remove(controlName: (keyof Controls) | string) {
        const control = this.controls[controlName as any] as FormControlImpl;
        if (control) {
            control.disconnect();
            delete this.controls[controlName];
            this.fireStateChange();
        }
    }

    attach(name: (keyof Controls) | string, options?: FormControlAttachOptions): (el: HTMLElement) => void {

        const control = this.controls[name] ? this.controls[name] as unknown as FormControlImpl : this.add(name as string) as FormControlImpl;

        if (options && "validators" in options) {
            control.setValidators(Array.isArray(options.validators) ? options.validators : [options.validators]);
        }

        return control.attach();
    }

    onStateChange(observer: (event: FormStateChange) => void): Subscription {
        return this.stateChanged.subscribe(event => observer(event));
    }

    onControlStateChange(observer: (event: {controlName: string} & FormControlStateChange) => void): Subscription {
        return this.controlStateChanged.subscribe(observer);
    }

    get dirty() {
        return this.status?.dirty || false;
    }

    get pristine() {
        return this.status?.pristine || false;
    }

    get touched() {
        return this.status?.touched || false;
    }

    get untouched() {
        return this.status?.untouched || false;
    }

    get valid() {
        return this.status?.valid || false;
    }

    get invalid() {
        return this.status?.invalid || false;
    }

    markAsDirty(): this {
        for (const control of Object.values(this.controls)) {
            control.markAsDirty();
        }

        return this;
    }

    markAsPristine(): this {
        for (const control of Object.values(this.controls)) {
            control.markAsPristine();
        }

        return this;
    }

    markAsTouched(): this {
        for (const control of Object.values(this.controls)) {
            control.markAsTouched();
        }

        return this;
    }

    markAsUntouched(): this {
        for (const control of Object.values(this.controls)) {
            control.markAsUntouched();
        }

        return this;
    }

    markAsReadonly(): this {

        for (const control of this.list()) {
            control.markAsReadonly();
        }

        return this;
    }

    markAsMutable(): this {

        for (const control of this.list()) {
            control.markAsMutable();
        }

        return this;
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
        const previousEvent = this.stateChanged.getValue();
        const currentState = this.state();

        const previousStatus = this.status;
        this.status = Object.assign({}, currentState, {controls: undefined});

        const statusChange = !deepEqual(this.status, previousStatus);
        const valueChange = !deepEqual(
            Object.entries(currentState?.controls || {}).map(entry => ({control: entry[0], value: entry[1].value})),
            Object.entries(previousEvent?.current?.controls || {}).map(entry => ({control: entry[0], value: entry[1].value}))
        );

        if (!checkForChange || (checkForChange && (statusChange || valueChange))) {
            console.debug(`[ionx-form-controller] form state changed`, currentState);

            this.runBindHost(currentState);

            if (this.renderer$) {
                forceUpdate(this.renderer$);
            }

            this.stateChanged.next({current: currentState, previous: previousEvent?.current, status: statusChange, value: valueChange});
        }

        if (currentState.valid) {
            this.errorPresenter$?.dismiss(this);
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

    async validate(options?: FormControllerValidateOptions): Promise<boolean> {

        const errorControls: FormControl[] = [];
        let firstErrorControl: FormControl;

        for (const control of this.orderedControls()) {
            if (!(await control.validate())) {
                errorControls.push(control);

                if (!firstErrorControl) {
                    if ((!options?.focusableControl || options?.focusableControl === "firstElement") && control.element) {
                        firstErrorControl = control;
                    } else if (options?.focusableControl === "first") {
                        firstErrorControl = control;
                    }
                }
            }
        }

        if (typeof options?.focusableControl === "function") {
            try {

                const result = options.focusableControl(errorControls);
                if (result instanceof Promise) {
                    firstErrorControl = await result;
                } else {
                    firstErrorControl = result;
                }

            } catch (e) {
                console.warn("[ionx-form-controller] Error in FormControllerValidateOptions.focusableControl()", e);
            }
        }

        if (!firstErrorControl && errorControls.length > 0) {
            firstErrorControl = errorControls[0];
        }

        if (firstErrorControl) {

            if (!options?.preventFocus) {

                if (options?.beforeFocus) {
                    try {
                        const res = options.beforeFocus(firstErrorControl);
                        if (res instanceof Promise) {
                            await res;
                        }
                    } catch (e) {
                        console.warn(e);
                    }
                }

                firstErrorControl.focus({preventScroll: options?.preventScroll, waitForElement: options?.waitForFocusElement});
            }

            this.errorPresenter$?.present(this, firstErrorControl);

            return false;

        } else {

            this.errorPresenter$?.dismiss(this);

            return true;
        }
    }

    /**
     * Returns ordered (by the sequence of appearance in DOM) list of controls,
     * when ordering is not available, controls will be ordered randomly
     */
    private orderedControls(): FormControl<Controls[keyof Controls]["value"] | any>[] {

        let firstControl: FormControl;
        const controls = [];

        const allControls: FormControl[] = [];
        for (const control of this.list()) {
            allControls.push(control);

            if (!firstControl && control.element) {
                firstControl = control;
            }
        }

        ORDERED: if (firstControl) {

            const getParents = (parents: HTMLElement[], el: HTMLElement) => {

                const parent = el.parentElement;
                if (parent) {
                    parents.push(parent);

                    if (parent.tagName !== "IONX-FORM") {
                        getParents(parents, el.parentElement);
                    }
                }

                return parents;
            }

            const tree = getParents([], firstControl.element);

            for (const control of allControls) {

                if (control === firstControl || !control.element) {
                    // omit controls without element
                    continue;
                }

                let parent = control.element.parentElement;
                if (!parent) {
                    // no common parent
                    break ORDERED;
                }

                let treeIndex = tree.indexOf(parent);
                while (treeIndex < 0) {
                    parent = parent.parentElement;

                    if (!parent) {
                        // no common parent
                        break ORDERED;
                    }

                    treeIndex = tree.indexOf(parent);
                }

                tree.splice(0, treeIndex);
            }

            const topParent = tree.length > 0 ? tree[0] : undefined;

            if (topParent) {

                const elements = topParent.querySelectorAll("[ionx-form-control]");
                for (let i = 0; i < elements.length; i++) {
                    const control = allControls.find(c => c.element === elements[i]);
                    if (control) {
                        controls.push(control);
                    }
                }

                // add controls without elements
                for (const control of allControls) {
                    if (!controls.includes(control)) {
                        controls.push(control);
                    }
                }
            }
        }

        if (controls.length > 0) {
            return controls;
        }

        return allControls;
    }

    /**
     * Binds control
     * @param host
     * @param controls
     */
    bindStates(host: any, controls?: string[] | {[controlName: string]: string}): this {

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

        return this;
    }

    bindRenderer(component: {render: () => void}): this {
        this.renderer$ = component;
        return this;
    }

    /**
     * Detach all HTML elements from the form, closes all observables and unbind hosts.
     * Should be called within disconnectedCallback to free memory resource.
     */
    disconnect() {

        this.bindHosts = [];
        this.renderer$ = undefined;

        const lastState = this.stateChanged.value;
        this.stateChanged.complete();
        this.stateChanged = new BehaviorSubject(lastState);

        this.controlStateChanged.complete();
        this.controlStateChanged = new Subject();

        for (const controlName in this.controls) {
            (this.controls[controlName] as FormControlImpl).disconnect();
        }
    }
}
