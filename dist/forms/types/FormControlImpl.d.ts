import { Observable } from "rxjs";
import { FormControl } from "./FormControl";
import { FormControlElement } from "./FormControlElement";
import { FormControlReadonlyState, FormControlState } from "./FormControlState";
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
  get valid(): boolean;
  get invalid(): boolean;
  get value(): Value;
  get element(): HTMLElement & Partial<FormControlElement>;
  get error(): Error;
  get stateChanges(): Observable<{
    current: FormControlReadonlyState<Value>;
    previous: FormControlReadonlyState<Value>;
  }>;
  onStateChange(observer: (event: {
    current: FormControlReadonlyState<Value>;
    previous: FormControlReadonlyState<Value>;
  }) => void): import("rxjs").Subscription;
  focus(options?: FocusOptions & {
    waitForElement?: boolean | number;
  }): Promise<void>;
  markAsDirty(): void;
  markAsTouched(): void;
  markAsUntouched(): void;
  markAsPristine(): void;
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
  /**
   * Potrzebujemy wiedzieć czy ilość wywołan attach z elementem zgadza sie z iloscia wywolan bez elementu.
   */
  private attachCount;
  attach(): (element: HTMLElement) => void;
  attach(element: HTMLElement): any;
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
  private unlistenOnChange;
  private unlistenOnFocus;
  private validators$;
  private touched$;
  private dirty$;
  private disabled$;
  private valid$;
  private value$;
  private error$;
  private validated$;
  private stateChanges$;
  private applyState;
  private onElementChange;
  private applyElementState;
  private fireStateChange;
  disconnect(): void;
}
