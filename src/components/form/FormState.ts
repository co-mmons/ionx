import {FormControlState} from "./FormControlState";

export interface FormState {
    readonly touched: boolean;
    readonly untouched: boolean;
    readonly dirty: boolean;
    readonly pristine: boolean;
    readonly valid: boolean;
    readonly invalid: boolean;
    readonly controls?: {[name: string]: FormControlState};
}
