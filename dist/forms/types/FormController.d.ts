import { Subscription } from "rxjs";
import { FormControl } from "./FormControl";
import { FormControlAttachOptions } from "./FormControlAttachOptions";
import { FormControllerPublicApi, FormControllerValidateOptions } from "./FormControllerPublicApi";
import { FormControlState } from "./FormControlState";
import { FormControlStateChange } from "./FormControlStateChange";
import { FormState } from "./FormState";
import { FormStateChange } from "./FormStateChange";
import { FormValidationErrorPresenter } from "./FormValidationErrorPresenter";
import { FormValidator } from "./FormValidator";
export declare type FormKnownControls = {
  [name: string]: {
    value?: any;
    validators?: FormValidator[];
  };
};
/**
 *
 */
export declare class FormController<Controls extends FormKnownControls = any> implements FormControllerPublicApi {
  constructor(controls?: Controls, options?: {
    errorHandler?: FormValidationErrorPresenter;
  });
  readonly controls: {
    [controlName: string]: FormControl<any>;
  } & {
    [controlName in keyof Controls]: FormControl<Controls[controlName]["value"]>;
  };
  private stateChanged;
  private controlStateChanged;
  private bindHosts;
  private renderer$;
  private errorPresenter$;
  private status;
  get renderer(): {
    render: () => void;
  };
  set renderer(renderer: {
    render: () => void;
  });
  set errorPresenter(presenter: FormValidationErrorPresenter);
  setErrorPresenter(errorHandler: FormValidationErrorPresenter): this;
  entries(): Array<[name: keyof Controls | string, control: FormControl<Controls[keyof Controls]["value"] | any>]>;
  /**
   * Returns list of controls.
   */
  list(): FormControl<Controls[keyof Controls]["value"] | any>[];
  /**
   * Returns names of all controls.
   */
  names(): Array<keyof Controls | string>;
  /**
   * Returns states for all controls.
   */
  states(): {
    [controlName in keyof Controls]: FormControlState<Controls[controlName]["value"]>;
  } & {
    [controlName: string]: FormControlState;
  };
  has(controlName: string): boolean;
  add(controlName: string, options?: {
    value?: any;
    validators?: FormValidator[];
  }): FormControl<any> & FormControl<Controls[string]["value"]>;
  remove(controlName: (keyof Controls) | string): void;
  attach(name: (keyof Controls) | string, options?: FormControlAttachOptions): (el: HTMLElement) => void;
  onStateChange(observer: (event: FormStateChange) => void): Subscription;
  onControlStateChange(observer: (event: {
    controlName: string;
  } & FormControlStateChange) => void): Subscription;
  get dirty(): boolean;
  get pristine(): boolean;
  get touched(): boolean;
  get untouched(): boolean;
  get valid(): boolean;
  get invalid(): boolean;
  markAsDirty(): this;
  markAsPristine(): this;
  markAsTouched(): this;
  markAsUntouched(): this;
  markAsReadonly(): this;
  markAsMutable(): this;
  state(): FormState;
  setStates(states: {
    [controlName: string]: FormControlState;
  }): void;
  private fireStateChange;
  private runBindHost;
  validate(options?: FormControllerValidateOptions): Promise<boolean>;
  /**
   * Returns ordered (by the sequence of appearance in DOM) list of controls,
   * when ordering is not available, controls will be ordered randomly
   */
  private orderedControls;
  /**
   * Binds control
   * @param host
   * @param controls
   */
  bindStates(host: any, controls?: string[] | {
    [controlName: string]: string;
  }): this;
  bindRenderer(component: {
    render: () => void;
  }): this;
  /**
   * Detach all HTML elements from the form, closes all observables and unbind hosts.
   * Should be called within disconnectedCallback to free memory resource.
   */
  disconnect(): void;
}
