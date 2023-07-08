import { Observable } from "rxjs";
import { FormControl } from "./FormControl";
import { FormControlElement } from "./FormControlElement";
import { FormControlReadonlyState, FormControlState } from "./FormControlState";
import { FormControlStateChange } from "./FormControlStateChange";
import { FormControlReadonlyStatus } from "./FormControlStatus";
import { FormValidator } from "./FormValidator";
export declare class FormControlImpl<Value = any> implements FormControl<Value> {
  readonly name: string;
  constructor(name: string);
  get touched(): boolean;
  get untouched(): boolean;
  get dirty(): boolean;
  get pristine(): boolean;
  get enabled(): boolean;
  get disabled(): boolean;
  get readonly(): boolean;
  get mutable(): boolean;
  get valid(): boolean;
  get invalid(): boolean;
  get value(): Value;
  get element(): HTMLElement & Partial<FormControlElement>;
  get error(): Error;
  get stateChanges(): Observable<FormControlStateChange<Value>>;
  onStateChange(observer: (event: FormControlStateChange<Value>) => void): import("rxjs").Subscription;
  focus(options?: FocusOptions & {
    waitForElement?: boolean | number;
  }): Promise<void>;
  markAsDirty(): void;
  markAsTouched(): void;
  markAsUntouched(): void;
  markAsPristine(): void;
  markAsReadonly(): void;
  markAsMutable(): void;
  setValidators(validators: FormValidator | FormValidator[]): void;
  getValidators(): FormValidator[];
  clearValidators(): void;
  enable(): void;
  disable(): void;
  setValue(value: Value, options?: {
    dirty?: boolean;
    touched?: boolean;
  }): void;
  validate(): Promise<boolean>;
  status(): FormControlReadonlyStatus;
  state(): FormControlReadonlyState;
  attach(): (element: HTMLElement) => void;
  mutableState(): FormControlState;
  detach(): void;
  /**
   * Doesn't fire change observers.
   */
  setState(state: FormControlState, options?: {
    preventEvent: boolean;
  }): {
    valueChange: boolean;
    statusChange: boolean;
  };
  validateImpl(options: {
    trigger: "valueChange" | "validate";
  }): Promise<boolean>;
  private element$;
  private unlisteners;
  private validators$;
  private touched$;
  private dirty$;
  private valid$;
  private value$;
  private error$;
  private validated$;
  private disabled$;
  private readonly$;
  private stateChanges$;
  private applyState;
  private onElementChange;
  private applyElementState;
  private fireStateChange;
  disconnect(): void;
}
