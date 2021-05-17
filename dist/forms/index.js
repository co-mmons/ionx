import { h as h$1, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { forceUpdate, h } from '@stencil/core';
import { deepEqual } from 'fast-equals';
import { Subject, BehaviorSubject } from 'rxjs';
import { waitTill } from '@co.mmons/js-utils/core';
import { isHydrated, addEventListener } from 'ionx/utils';
import scrollIntoView from 'scroll-into-view';
import { intl, setMessages, MessageRef } from '@co.mmons/js-intl';
import ExtendableError from 'ts-error';

let loaded = [];
async function importJson() {
  const locale = intl.locale;
  switch (locale) {case "cs": return (await import('./cs.js')).default;
case "da": return (await import('./da.js')).default;
case "de": return (await import('./de.js')).default;
case "en": return (await import('./en.js')).default;
case "fr": return (await import('./fr.js')).default;
case "hu": return (await import('./hu.js')).default;
case "nl": return (await import('./nl.js')).default;
case "pl": return (await import('./pl.js')).default;
case "ru": return (await import('./ru.js')).default;

  }
  return Promise.resolve({});
}
async function loadIntlMessages() {
  if (loaded.includes(intl.locale)) {
    return;
  }
  setMessages("ionx/forms", intl.locale, await importJson());
  loaded.push(intl.locale);
}

const detachFunctionName = "__ionxFormControlDetach";
class FormControlImpl {
  constructor(name) {
    this.name = name;
    this.touched$ = false;
    this.dirty$ = false;
    this.disabled$ = false;
    this.valid$ = true;
    this.stateChanges$ = new Subject();
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
  get stateChanges() {
    return this.stateChanges$;
  }
  onStateChange(observer) {
    return this.stateChanges$.subscribe(change => observer(change));
  }
  async focus(options) {
    if (!this.element$ && ((options === null || options === void 0 ? void 0 : options.waitForElement) === true || (typeof (options === null || options === void 0 ? void 0 : options.waitForElement) === "number" && options.waitForElement > 0))) {
      try {
        await waitTill(() => !!this.element$ && isHydrated(this.element$), undefined, typeof options.waitForElement === "number" ? options.waitForElement : 1000);
      }
      catch (_a) {
      }
    }
    if (this.element$) {
      if (this.element$.setFocus) {
        await this.element$.setFocus(options);
      }
      else if (this.element$.tagName.startsWith("ION-") || this.element$.tagName.startsWith("IONX-")) {
        if (!(options === null || options === void 0 ? void 0 : options.preventScroll)) {
          scrollIntoView(this.element$.closest("ion-item") || this.element$);
        }
      }
      else {
        this.element$.focus(options);
      }
    }
  }
  markAsDirty() {
    this.applyState({ dirty: true });
  }
  markAsTouched() {
    this.applyState({ touched: true });
  }
  markAsUntouched() {
    this.applyState({ touched: false });
  }
  markAsPristine() {
    this.applyState({ dirty: false });
  }
  setValidators(validators) {
    this.validators$ = Array.isArray(validators) ? validators.slice() : (validators ? [validators] : []);
  }
  getValidators() {
    return this.validators$.slice();
  }
  clearValidators() {
    this.validators$ = undefined;
  }
  enable() {
    this.applyState({ disabled: false });
  }
  disable() {
    this.applyState({ disabled: true });
  }
  setValue(value, options) {
    const state = { value: value };
    if (typeof (options === null || options === void 0 ? void 0 : options.dirty) === "boolean") {
      state.dirty = options.dirty;
    }
    else if (typeof (options === null || options === void 0 ? void 0 : options.touched) === "boolean") {
      state.dirty = options.touched;
    }
    this.applyState(state);
    this.validateImpl({ trigger: "valueChange" });
  }
  async validate() {
    return this.validateImpl({ trigger: "validate" });
  }
  status() {
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
    };
  }
  state() {
    return this.mutableState();
  }
  attach() {
    const detachFunctionName = "__ionxFormControlDetach";
    const control = this;
    const func = function (el) {
      var _a, _b;
      if (!el) {
        (_a = this[detachFunctionName]) === null || _a === void 0 ? void 0 : _a.call(this);
      }
      else {
        // do nothing, as nothing really changed
        if (el[detachFunctionName] === this[detachFunctionName] && el === control.element$) {
          return;
        }
        // detach previously attached element
        if (el !== control.element$ && control.element$) {
          control.detach();
        }
        // detach function if given element was already attached somewhere
        (_b = el[detachFunctionName]) === null || _b === void 0 ? void 0 : _b.call(el, control);
        // define detach function
        // returns true if control was detached or false if it wasn't needed
        this[detachFunctionName] = el[detachFunctionName] = (newControl) => {
          if (control !== newControl) {
            control.detach();
          }
          delete this[detachFunctionName];
        };
        if (control.element$ !== el) {
          console.debug(`[ionx-form-control] attach control ${control.name}`, el);
          control.element$ = el;
          control.element$.setAttribute("ionx-form-control", control.name);
          control.unlistenOnChange = addEventListener(control.element$, control.element$.formValueChangeEventName || "ionChange", ev => control.onElementChange(ev));
          control.unlistenOnFocus = addEventListener(control.element$, control.element$.formTouchEventName || "ionFocus", () => control.markAsTouched());
          control.applyElementState({ value: control.value$, valueChange: true, status: control.status(), statusChange: true });
        }
      }
    };
    return func.bind(func);
  }
  //
  // ------------ INTERNAL API -----------
  //
  mutableState() {
    return Object.assign({ value: this.value }, this.status());
  }
  detach() {
    var _a, _b;
    if (this.element$) {
      console.debug(`[ionx-form-control] detach control ${this.name}`, this.element$);
      (_a = this.unlistenOnChange) === null || _a === void 0 ? void 0 : _a.call(this);
      this.unlistenOnChange = undefined;
      (_b = this.unlistenOnFocus) === null || _b === void 0 ? void 0 : _b.call(this);
      this.unlistenOnFocus = undefined;
      delete this.element$[detachFunctionName];
      this.element$.removeAttribute("ionx-form-control");
      this.element$ = undefined;
    }
  }
  /**
   * Doesn't fire change observers.
   */
  setState(state, options) {
    return this.applyState(state, options);
  }
  async validateImpl(options) {
    await loadIntlMessages();
    this.validated$ = true;
    let error;
    if (this.validators$) {
      VALIDATORS: for (const validator of this.validators$) {
        try {
          const result = validator(this, options);
          if (result instanceof Promise) {
            await result;
          }
        }
        catch (er) {
          error = er instanceof Error ? er : new Error(er);
          break VALIDATORS;
        }
      }
    }
    if (error) {
      this.error$ = error;
      this.applyState({ valid: false });
      return false;
    }
    else {
      this.error$ = undefined;
      this.applyState({ valid: true });
      return true;
    }
  }
  applyState(state, options) {
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
        }
        else {
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
      this.fireStateChange({ status, value });
    }
    return { valueChange: valueChange, statusChange: statusChange };
  }
  onElementChange(ev) {
    if (ev.target !== this.element$) {
      return;
    }
    const value = "checked" in ev.detail ? ev.detail.checked : ev.detail.value;
    const state = { value };
    if (!deepEqual(this.value$, value)) {
      state.dirty = true;
    }
    this.applyState(state, { trigger: "elementValueChange" });
    this.validateImpl({ trigger: "valueChange" });
  }
  applyElementState(state) {
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
          }
          else if (key === "dirty") {
            classes.push("ion-pristine");
          }
          else if (key === "valid") {
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
                }
                else {
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
        }
        catch (error) {
          console.warn(`[ionx-form-control] unhandled error`, error);
        }
      }
      else {
        if (state.valueChange) {
          if (tagName === "ion-checkbox" || tagName === "ion-toggle") {
            this.element$.checked = !!this.value$;
          }
          else {
            this.element$["value"] = this.value$;
          }
        }
        if (state.statusChange) {
          this.element$["disabled"] = state.status.disabled;
        }
      }
    }
  }
  fireStateChange(previous) {
    const status = this.status();
    const statusChanged = !!("status" in previous && !deepEqual(previous.status, status));
    const valueChanged = !!("value" in previous && !deepEqual(previous.value, this.value$));
    if (statusChanged || valueChanged) {
      console.debug(`[ionx-form-control] state of "${this.name}" changed: {status: ${statusChanged}, value: ${valueChanged}}`);
      const previousStatus = "status" in previous ? previous.status : status;
      const previousValue = "value" in previous ? previous.value : this.value$;
      this.stateChanges.next({
        current: Object.assign({ value: this.value$ }, status),
        previous: Object.assign({ value: previousValue }, previousStatus),
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

/**
 *
 */
class FormController {
  constructor(controls, options) {
    this.controls = {};
    this.stateChanged = new BehaviorSubject({ current: this.state(), previous: null, value: false, status: false });
    this.bindHosts = [];
    if (controls) {
      for (const controlName of (Array.isArray(controls) ? controls : Object.keys(controls))) {
        this.add(controlName, (!Array.isArray(controls) && controls[controlName]) || undefined);
      }
    }
    if (options === null || options === void 0 ? void 0 : options.errorHandler) {
      this.errorPresenter$ = options.errorHandler;
    }
  }
  set errorPresenter(presenter) {
    this.setErrorPresenter(presenter);
  }
  setErrorPresenter(errorHandler) {
    if (this.errorPresenter$) {
      this.errorPresenter$.dismiss(this);
    }
    this.errorPresenter$ = errorHandler;
    return this;
  }
  /**
   * Returns list of controls.
   */
  list() {
    return Object.values(this.controls);
  }
  /**
   * Returns names of all controls.
   */
  names() {
    return Object.keys(this.controls);
  }
  /**
   * Returns states for all controls.
   */
  states() {
    const states = {};
    for (const control of this.list()) {
      states[control.name] = control.mutableState();
    }
    return states;
  }
  add(controlName, options) {
    const exists = !!this.controls[controlName];
    if (!this.controls[controlName]) {
      this.controls[controlName] = new FormControlImpl(controlName);
      this.controls[controlName].onStateChange(() => this.fireStateChange());
    }
    if (options && "value" in options) {
      this.controls[controlName].setValue(options.value);
    }
    else if (!exists) {
      this.fireStateChange();
    }
    if (options === null || options === void 0 ? void 0 : options.validators) {
      this.controls[controlName].setValidators(options.validators);
    }
    return this.controls[controlName];
  }
  remove(controlName) {
    const control = this.controls[controlName];
    if (control) {
      control.disconnect();
      delete this.controls[controlName];
      this.fireStateChange();
    }
  }
  attach(name, options) {
    const control = this.controls[name] ? this.controls[name] : this.add(name);
    if (options && "validators" in options) {
      control.setValidators(Array.isArray(options.validators) ? options.validators : [options.validators]);
    }
    return control.attach();
  }
  onStateChange(observer) {
    return this.stateChanged.subscribe(event => observer(event));
  }
  get dirty() {
    var _a;
    return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.dirty) || false;
  }
  get pristine() {
    var _a;
    return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.pristine) || false;
  }
  get touched() {
    var _a;
    return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.touched) || false;
  }
  get untouched() {
    var _a;
    return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.untouched) || false;
  }
  get valid() {
    var _a;
    return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.valid) || false;
  }
  get invalid() {
    var _a;
    return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.invalid) || false;
  }
  markAsDirty() {
    for (const control of Object.values(this.controls)) {
      control.markAsDirty();
    }
  }
  markAsPristine() {
    for (const control of Object.values(this.controls)) {
      control.markAsPristine();
    }
  }
  markAsTouched() {
    for (const control of Object.values(this.controls)) {
      control.markAsTouched();
    }
  }
  markAsUntouched() {
    for (const control of Object.values(this.controls)) {
      control.markAsUntouched();
    }
  }
  state() {
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
    return state;
  }
  setStates(states) {
    let anyChange = false;
    for (const controlName in states) {
      if (this.controls[controlName]) {
        const { statusChange, valueChange } = this.controls[controlName].setState(states[controlName], { preventEvent: true });
        if (statusChange || valueChange) {
          anyChange = true;
        }
      }
    }
    if (anyChange) {
      this.fireStateChange(false);
    }
  }
  fireStateChange(checkForChange = true) {
    var _a, _b;
    const previousEvent = this.stateChanged.getValue();
    const currentState = this.state();
    const previousStatus = this.status;
    this.status = Object.assign({}, currentState, { controls: undefined });
    const statusChange = !deepEqual(this.status, previousStatus);
    const valueChange = !deepEqual(Object.entries((currentState === null || currentState === void 0 ? void 0 : currentState.controls) || {}).map(entry => ({ control: entry[0], value: entry[1].value })), Object.entries(((_a = previousEvent === null || previousEvent === void 0 ? void 0 : previousEvent.current) === null || _a === void 0 ? void 0 : _a.controls) || {}).map(entry => ({ control: entry[0], value: entry[1].value })));
    if (!checkForChange || (checkForChange && (statusChange || valueChange))) {
      console.debug(`[ionx-form-controller] form state changed`, currentState);
      this.runBindHost(currentState);
      if (this.renderer) {
        forceUpdate(this.renderer);
      }
      this.stateChanged.next({ current: currentState, previous: previousEvent === null || previousEvent === void 0 ? void 0 : previousEvent.current, status: statusChange, value: valueChange });
    }
    if (currentState.valid) {
      (_b = this.errorPresenter$) === null || _b === void 0 ? void 0 : _b.dismiss(this);
    }
  }
  runBindHost(state) {
    if (this.bindHosts.length > 0) {
      let all;
      for (const host of this.bindHosts) {
        if (!host[1] && !all) {
          all = Object.assign({}, ...(Object.keys(this.controls).map(controlName => ({ [controlName]: undefined }))));
        }
        for (const controlName in (host[1] || all)) {
          try {
            host[0][(host[1] && host[1][controlName]) || controlName] = state.controls[controlName] && state.controls[controlName];
          }
          catch (error) {
            console.warn(`[ionx-form-controller] error when binding control states to host`, host, error);
          }
        }
      }
    }
  }
  async validate(options) {
    var _a, _b;
    let firstErrorControl;
    for (const control of this.orderedControls()) {
      if (!(await control.validate()) && control.element && !firstErrorControl) {
        firstErrorControl = control;
      }
    }
    if (firstErrorControl) {
      if (!(options === null || options === void 0 ? void 0 : options.preventFocus)) {
        if (options === null || options === void 0 ? void 0 : options.beforeFocus) {
          try {
            const res = options.beforeFocus(firstErrorControl);
            if (res instanceof Promise) {
              await res;
            }
          }
          catch (e) {
            console.warn(e);
          }
        }
        firstErrorControl.focus({ preventScroll: options === null || options === void 0 ? void 0 : options.preventScroll });
      }
      (_a = this.errorPresenter$) === null || _a === void 0 ? void 0 : _a.present(this, firstErrorControl);
      return false;
    }
    else {
      (_b = this.errorPresenter$) === null || _b === void 0 ? void 0 : _b.dismiss(this);
      return true;
    }
  }
  /**
   * Returns ordered (by the sequence of appearance in DOM) list of controls,
   * when ordering is not available, controls will be ordered randomly
   */
  orderedControls() {
    let firstControl;
    const controls = [];
    const allControls = [];
    for (const controlName in this.controls) {
      allControls.push(this.controls[controlName]);
      if (!firstControl && this.controls[controlName].element) {
        firstControl = this.controls[controlName];
      }
    }
    ORDERED: if (firstControl) {
      const getParents = (parents, el) => (!!el.parentElement ? parents.push(el.parentElement) && getParents(parents, el.parentElement) : true) && parents;
      const tree = getParents([], firstControl.element);
      for (const controlName in this.controls) {
        const control = this.controls[controlName];
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
          const control = this.controls[elements[i].getAttribute("ionx-form-control")];
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
  bindStates(host, controls) {
    let bindRecord;
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
    }
    else if (Array.isArray(controls)) {
      bindRecord[1] = controls.length > 0 ? Object.assign({}, ...(controls.map(controlName => ({ [controlName]: undefined })))) : undefined;
    }
    else {
      bindRecord[1] = Object.keys(controls).length > 0 ? controls : undefined;
    }
    return this;
  }
  bindRenderer(component) {
    this.renderer = component;
    return this;
  }
  /**
   * Detach all HTML elements from the form, closes all observables and unbind hosts.
   * Should be called within disconnectedCallback to free memory resource.
   */
  disconnect() {
    this.bindHosts = [];
    this.renderer = undefined;
    const lastState = this.stateChanged.value;
    this.stateChanged.complete();
    this.stateChanged = new BehaviorSubject(lastState);
    for (const controlName in this.controls) {
      this.controls[controlName].disconnect();
    }
  }
}

function formGrid(el) {
  if (el) {
    el.style.setProperty("--ion-grid-column-padding", "8px");
    el.style.setProperty("--ion-grid-padding", "8px");
  }
}

class FormValidationError extends ExtendableError {
  constructor(message) {
    super();
    this.message = message ? message : intl.message `ionx/forms#InvalidValueError|message`;
  }
}

const FormFieldLabelButton = (props, children) => {
  return h("ion-button", Object.assign({}, props, { size: "small", fill: "clear", slot: "label-end" }), children);
};

async function required(control) {
  const value = control.value;
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
    throw new RequiredError();
  }
}
class RequiredError extends FormValidationError {
  constructor() {
    super(intl.message `ionx/forms#RequiredError|message`);
  }
}

async function requiredTrue(control) {
  const value = control.value;
  if (value !== true) {
    throw new RequiredError();
  }
}

function minLength(minLength) {
  return async function (control) {
    const value = control.value;
    if (typeof value !== "string" || value.length < minLength) {
      throw new MinLengthError(minLength);
    }
  };
}
class MinLengthError extends FormValidationError {
  constructor(minLength) {
    super(intl.message("ionx/forms#MinLengthError|message", { length: minLength }));
  }
}

const emailRegexp = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
 * Validator that requires the control's value pass an email validation test.
 *
 * Tests the value using a [regular
 * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
 * pattern suitable for common usecases. The pattern is based on the definition of a valid email
 * address in the [WHATWG HTML
 * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
 * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
 * lengths of different parts of the address).
 *
 * The differences from the WHATWG version include:
 * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
 * - Disallow `local-part` to be longer than 64 characters.
 * - Disallow the whole address to be longer than 254 characters.
 *
 * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
 * validate the value against a different pattern.
 *
 * @throws InvalidEmailError
 *
 * @link https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
async function validEmail(control) {
  const value = control.value;
  if (value !== null && value !== undefined) {
    if (typeof value === "string" && (value.length === 0 || emailRegexp.test(value))) {
      return;
    }
    throw new InvalidEmailError();
  }
}
class InvalidEmailError extends FormValidationError {
  constructor() {
    super();
  }
}

function matchPattern(pattern, message) {
  return async function (control) {
    const value = control.value;
    if (typeof value !== "string" || !pattern.test(value)) {
      throw new FormValidationError(message);
    }
  };
}

const FormControllerComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    /**
     * If controller should be disconnected when component is disconnected from the DOM.
     * By default is true, but you can set to false when you expect that form controller component
     * can be connected/disconnected to DOM multiple times (e.g. when conditional rendering takes place).
     */
    this.disconnect = true;
  }
  async attach(name, options) {
    this.controller.attach(name, options);
  }
  validate(options) {
    return this.controller.validate(options);
  }
  async componentWillLoad() {
    await loadIntlMessages();
  }
  render() {
    return h$1(Host, null, h$1("slot", null));
  }
  disconnectedCallback() {
    if (this.disconnect) {
      this.controller.disconnect();
    }
  }
};

const formFieldCss = "@charset \"UTF-8\";.sc-ionx-form-field-h{--form-field--invalid-color:var(--form-field-invalid-color, var(--ion-color-danger));--form-field--label-height:var(--form-field-label-height, 16px);--form-field--label-font-size:var(--form-field-label-font-size, 14px);display:block}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field{border-width:var(--ionx-border-width, 1px);border-color:var(--ion-border-color);border-radius:var(--ionx-border-radius);border-style:solid;position:relative;margin:0;padding:0}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>legend.sc-ionx-form-field{line-height:var(--form-field--label-height);margin:0 12px;padding:0 4px;display:flex;justify-items:center;justify-content:center;align-content:center;align-items:center}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>legend.sc-ionx-form-field [slot-container=label].sc-ionx-form-field{font-weight:var(--form-field-label-font-weight, 400);font-size:var(--form-field--label-font-size)}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>legend.sc-ionx-form-field [slot-container=label-end].sc-ionx-form-field{display:none}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>legend.sc-ionx-form-field [slot-container=label-end].sc-ionx-form-field:not(:empty){display:contents;height:var(--form-field--label-height);border-radius:var(--ionx-border-radius)}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[slot-container=description].sc-ionx-form-field{margin:4px 16px 0 16px;font-size:calc(var(--form-field--label-font-size) - 2px);line-height:1.1}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[slot-container=description].sc-ionx-form-field:empty{display:none}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[slot-container=placeholder].sc-ionx-form-field{margin:16px}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[slot-container=placeholder].sc-ionx-form-field:empty{display:none}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[ionx--content].sc-ionx-form-field{display:flex}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[ionx--content].sc-ionx-form-field>[slot-container=default].sc-ionx-form-field{flex:1}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[ionx--content].sc-ionx-form-field>[slot-container=start].sc-ionx-form-field,.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[ionx--content].sc-ionx-form-field>[slot-container=end].sc-ionx-form-field{align-self:center}.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[ionx--content].sc-ionx-form-field>[slot-container=start].sc-ionx-form-field:empty,.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>[ionx--content].sc-ionx-form-field>[slot-container=end].sc-ionx-form-field:empty{display:none}.sc-ionx-form-field-h>[slot-container=error].sc-ionx-form-field,.sc-ionx-form-field-h>[slot-container=hint].sc-ionx-form-field{margin:8px 16px 0px 16px;font-size:calc(var(--form-field--label-font-size) - 2px);line-height:1.1}.sc-ionx-form-field-h>[slot-container=error].sc-ionx-form-field:empty,.sc-ionx-form-field-h>[slot-container=hint].sc-ionx-form-field:empty{display:none}.sc-ionx-form-field-h>[slot-container=error].sc-ionx-form-field{color:var(--form-field--invalid-color)}.sc-ionx-form-field-h>[slot-container=hint].sc-ionx-form-field{color:rgba(var(--ion-text-color-rgb), 0.5)}.ion-invalid.sc-ionx-form-field-h>fieldset.sc-ionx-form-field{border-color:var(--form-field-invalid-border-color, var(--form-field--invalid-color))}.ion-invalid.sc-ionx-form-field-h>fieldset.sc-ionx-form-field>legend.sc-ionx-form-field [slot-container=label].sc-ionx-form-field{color:var(--form-field-invalid-label-color, var(--form-field--invalid-color))}.sc-ionx-form-field-s>[slot=label-end]{margin:0 8px}.sc-ionx-form-field-s>ion-button[slot=label-end]{height:16px;font-size:12px;font-weight:500;margin:0 0 0 4px;letter-spacing:initial;--padding-start:4px;--padding-end:4px}.sc-ionx-form-field-s>ion-button[slot=label-end].button-has-icon-only{--padding-start:0;--padding-end:0;font-size:10px}.sc-ionx-form-field-s>ion-button[slot=label-end]:first-child{margin-left:8px}.sc-ionx-form-field-s>ion-input,.sc-ionx-form-field-s>ion-textarea{--padding-start:16px;--padding-end:16px}.sc-ionx-form-field-s>ion-list{background:transparent;margin:10px 0 16px 0;padding:0}.sc-ionx-form-field-s>ion-list.list-lines-full ion-item:first-child{--border-width:var(--ionx-border-width) 0 var(--ionx-border-width) 0}.sc-ionx-form-field-s>ion-list:not(.list-lines-full){margin-left:16px;margin-right:16px}.sc-ionx-form-field-s>ion-list:not(.list-lines-full) ion-item{--inner-padding-start:0¬;--inner-padding-end:0;--padding-start:0;--padding-end:0}.sc-ionx-form-field-s>ion-list:not(.list-lines-full) ion-item:first-child{--inner-border-width:var(--ionx-border-width) 0 var(--ionx-border-width) 0}.sc-ionx-form-field-s>ionx-form-field{margin:16px}.sc-ionx-form-field-s>ion-toggle[slot=label-end]{padding:2px;height:12px;width:24px;--handle-width:12px;--handle-height:12px;--handle-max-height:12px}.sc-ionx-form-field-s>ion-toggle[slot=label-end].ios{padding:0px;height:16px;width:32px;--handle-width:10px;--handle-height:10px;--handle-max-height:10px}";

const FormField = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  watchErrorProps() {
    this.buildErrorMessage();
  }
  buildErrorMessage() {
    var _a;
    if (typeof this.error === "string") {
      this.errorMessage = this.error;
    }
    else if (this.error instanceof FormValidationError) {
      this.errorMessage = this.error.message;
    }
    else if (this.error instanceof MessageRef) {
      this.errorMessage = intl.message(this.error);
    }
    else if (this.error instanceof Error) {
      this.errorMessage = `${this.error.message}`;
    }
    else if (this.error) {
      this.errorMessage = intl.message `ionx/forms#validators/InvalidValueError`;
    }
    else if ((_a = this.control) === null || _a === void 0 ? void 0 : _a.error) {
      this.errorMessage = this.control.error.message;
    }
    else {
      this.errorMessage = undefined;
    }
  }
  async componentWillLoad() {
    await loadIntlMessages();
  }
  render() {
    return h$1(Host, null, h$1("fieldset", null, h$1("legend", null, h$1("div", { "slot-container": "label" }, h$1("slot", { name: "label" }, this.label)), h$1("div", { "slot-container": "label-end" }, h$1("slot", { name: "label-end" }))), h$1("div", { "slot-container": "description" }, h$1("slot", { name: "description" })), h$1("div", { "slot-container": "placeholder" }, h$1("slot", { name: "placeholder" })), h$1("div", { "ionx--content": true }, h$1("div", { "slot-container": "start" }, h$1("slot", { name: "start" })), h$1("div", { "slot-container": "default" }, h$1("slot", null)), h$1("div", { "slot-container": "end" }, h$1("slot", { name: "end" })))), h$1("div", { "slot-container": "error" }, this.errorMessage && h$1("span", { slot: "error" }, this.errorMessage), h$1("slot", { name: "error" })), h$1("div", { "slot-container": "hint" }, h$1("slot", { name: "hint" })));
  }
  static get watchers() { return {
    "control": ["watchErrorProps"],
    "error": ["watchErrorProps"]
  }; }
  static get style() { return formFieldCss; }
};

const formItemCss = ".sc-ionx-form-item-h{--form-item-solid-background-color:var(--ion-color-light);--form-item-focused-background-color:var(--ion-color-light-shade);position:relative;display:block}.sc-ionx-form-item-h [ionx--buttons].sc-ionx-form-item{display:none}.sc-ionx-form-item-h [ionx--buttons].sc-ionx-form-item:not(:empty){display:inline-flex;z-index:2;position:absolute;top:-9px;left:16px;height:20px;background:var(--ion-item-background, var(--ion-background-color, #fff));border-radius:var(--ionx-border-radius, 4px)}.sc-ionx-form-item-h>ion-item.sc-ionx-form-item{--padding-top:8px;--padding-start:0px;--padding-end:0px;--inner-padding-end:0px}[fill=clear].sc-ionx-form-item-h>ion-item.sc-ionx-form-item{--inner-border-width:0;--full-highlight-height:0}[fill=outline].sc-ionx-form-item-h>ion-item.sc-ionx-form-item{--padding-start:16px;--padding-end:16px;--border-width:var(--ionx-border-width, 1px);--border-radius:var(--ionx-border-radius, 4px) var(--ionx-border-radius, 4px) 0px 0px;--inner-border-width:0px;--full-highlight-height:2px}[fill=solid].sc-ionx-form-item-h>ion-item.sc-ionx-form-item{--padding-start:var(--item-padding-start, 16px);--padding-end:var(--item-padding-end, 16px);--inner-padding-start:var(--item-inner-padding-start, 0px);--inner-padding-end:var(--item-inner-padding-end, 0px);--background:var(--form-item-solid-background-color);--background-focused:var(--form-item-focused-background-color);--background-focused-opacity:1;--input-background-color:var(--form-item-solid-background-color);--input-focused-background-color:var(--form-item-focused-background-color);--border-width:0px 0px var(--ionx-border-width, 1px) 0px;--border-radius:var(--ionx-border-radius, 4px) var(--ionx-border-radius, 4px) 0px 0px;--inner-border-width:0px;--full-highlight-height:2px}.sc-ionx-form-item-s>ion-label{padding-left:var(--label-padding-start, 0px);padding-right:var(--label-padding-end, 0px)}.sc-ionx-form-item-s>ion-label.label-floating,.sc-ionx-form-item-s>ion-label.label-stacked{z-index:1}.sc-ionx-form-item-s>ion-input{--padding-end:0px;--padding-start:0px;z-index:0}.sc-ionx-form-item-s>[slot=end]{margin-left:0px}.sc-ionx-form-item-s>[slot=end]:last-child{margin-right:0px}.sc-ionx-form-item-h[fill=solid].sc-ionx-form-item-s>[slot=error],.sc-ionx-form-item-h[fill=solid].sc-ionx-form-item-s>[slot=hint],[fill=solid].sc-ionx-form-item-h>[ionx--error].sc-ionx-form-item,[fill=solid].sc-ionx-form-item-h>[ionx--hint].sc-ionx-form-item,.sc-ionx-form-item-h[fill=outline].sc-ionx-form-item-s>[slot=error],.sc-ionx-form-item-h[fill=outline].sc-ionx-form-item-s>[slot=hint],[fill=outline].sc-ionx-form-item-h>[ionx--error].sc-ionx-form-item,[fill=outline].sc-ionx-form-item-h>[ionx--hint].sc-ionx-form-item{margin-left:16px;margin-right:16px}.sc-ionx-form-item-s>[slot=error],.sc-ionx-form-item-s>[slot=hint],.sc-ionx-form-item-h>[ionx--error].sc-ionx-form-item,.sc-ionx-form-item-h>[ionx--hint].sc-ionx-form-item{margin-top:8px;font-size:small}.sc-ionx-form-item-s>[slot=error],.sc-ionx-form-item-h>[ionx--error].sc-ionx-form-item{color:var(--ion-color-danger)}.sc-ionx-form-item-s>[slot=hint],.sc-ionx-form-item-h>[ionx--hint].sc-ionx-form-item{color:rgba(var(--ion-text-color-rgb), 0.5)}.sc-ionx-form-item-s>ion-button[slot=buttons],.sc-ionx-form-item-s>[slot=buttons] ion-button{margin:0px;height:20px;font-size:11px;letter-spacing:initial}";

const FormItem = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  watchControl() {
    this.buildErrorMessage();
  }
  watchError() {
    this.buildErrorMessage();
  }
  buildErrorMessage() {
    var _a;
    if (typeof this.error === "string") {
      this.errorMessage = this.error;
    }
    else if (this.error instanceof FormValidationError) {
      this.errorMessage = this.error.message;
    }
    else if (this.error instanceof MessageRef) {
      this.errorMessage = intl.message(this.error);
    }
    else if (this.error instanceof Error) {
      this.errorMessage = `${this.error.message}`;
    }
    else if (this.error) {
      this.errorMessage = intl.message `ionx/forms#validators/InvalidValueError`;
    }
    else if ((_a = this.control) === null || _a === void 0 ? void 0 : _a.error) {
      this.errorMessage = this.control.error.message;
    }
    else {
      this.errorMessage = undefined;
    }
  }
  async componentWillLoad() {
    await loadIntlMessages();
  }
  render() {
    var _a;
    return h$1(Host, null, h$1("div", { "ionx--buttons": true }, h$1("slot", { name: "buttons" })), h$1("ion-item", Object.assign({}, (_a = this.partProps) === null || _a === void 0 ? void 0 : _a.item), h$1("slot", { name: "start", slot: "start" }), h$1("slot", null), h$1("slot", { name: "end", slot: "end" })), h$1("slot", { name: "error" }), !!this.errorMessage && h$1("div", { "ionx--error": true }, this.errorMessage), h$1("slot", { name: "hint" }), !!this.hint && h$1("div", { "ionx--hint": true }, this.hint));
  }
  static get watchers() { return {
    "control": ["watchControl"],
    "error": ["watchError"]
  }; }
  static get style() { return formItemCss; }
};

const IonxFormController = /*@__PURE__*/proxyCustomElement(FormControllerComponent, [4,"ionx-form-controller",{"controller":[16],"disconnect":[4]}]);
const IonxFormField = /*@__PURE__*/proxyCustomElement(FormField, [6,"ionx-form-field",{"label":[1],"control":[16],"error":[1],"errorMessage":[32]}]);
const IonxFormItem = /*@__PURE__*/proxyCustomElement(FormItem, [6,"ionx-form-item",{"fill":[513],"control":[16],"error":[1],"hint":[1],"partProps":[16],"errorMessage":[32]}]);
const defineIonxForms = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxFormController,
  IonxFormField,
  IonxFormItem
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { FormController, FormFieldLabelButton, FormValidationError, IonxFormController, IonxFormField, IonxFormItem, defineIonxForms, formGrid, loadIntlMessages as loadIonxFormsIntl, matchPattern, minLength, required, requiredTrue, validEmail };
