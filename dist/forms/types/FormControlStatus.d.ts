import { FormValidationError } from "./FormValidationError";
export interface FormControlStatus {
  touched: boolean;
  readonly untouched: boolean;
  dirty: boolean;
  readonly pristine: boolean;
  disabled: boolean;
  readonly enabled: boolean;
  valid: boolean;
  readonly invalid: boolean;
  readonly: boolean;
  readonly mutable: boolean;
  error: FormValidationError;
}
export interface FormControlReadonlyStatus extends Readonly<FormControlStatus> {
}
