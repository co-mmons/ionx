import { Observable, Subscription } from "rxjs";
import { FormControlReadonlyState } from "./FormControlState";
import { FormControlStateChange } from "./FormControlStateChange";
import { FormControlReadonlyStatus } from "./FormControlStatus";
import { FormValidationError } from "./FormValidationError";
import { FormValidator } from "./FormValidator";
export interface FormControl<Value = any> {
  readonly name: string;
  readonly element: HTMLElement;
  readonly valid: boolean;
  readonly invalid: boolean;
  readonly error: FormValidationError;
  readonly dirty: boolean;
  readonly pristine: boolean;
  readonly touched: boolean;
  readonly untouched: boolean;
  readonly disabled: boolean;
  readonly enabled: boolean;
  readonly readonly: boolean;
  readonly mutable: boolean;
  readonly value: Value;
  readonly stateChanges: Observable<FormControlStateChange<Value>>;
  setValue(value: Value, options?: {
    dirty?: boolean;
    touched?: boolean;
  }): any;
  focus(options?: FocusOptions & {
    waitForElement?: boolean | number;
  }): void;
  enable(): void;
  disable(): void;
  markAsReadonly(): void;
  markAsMutable(): void;
  markAsDirty(): void;
  markAsPristine(): void;
  markAsTouched(): void;
  markAsUntouched(): void;
  attach(): (element: HTMLElement) => void;
  validate(): Promise<boolean>;
  setValidators(validators: FormValidator | FormValidator[]): any;
  clearValidators(): void;
  status(): FormControlReadonlyStatus;
  state(): FormControlReadonlyState;
  onStateChange(observer: (event: FormControlStateChange<Value>) => void): Subscription;
}
