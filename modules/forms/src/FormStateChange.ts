import {FormState} from "./FormState";

export interface FormStateChange {
    current: FormState;
    previous: FormState;
    value: boolean;
    status: boolean;
}
