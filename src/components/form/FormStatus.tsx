import {FormValidationError} from "./FormValidationError";

export interface FormStatus {
    readonly touched: boolean;
    readonly untouched: boolean;
    readonly dirty: boolean;
    readonly pristine: boolean;
    readonly disabled: boolean;
    readonly enabled: boolean;
    readonly valid: boolean;
    readonly invalid: boolean;
    readonly error: FormValidationError;
}
