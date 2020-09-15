import {FormControlReadonlyStatus} from "./FormControlStatus";

export interface ApplyFormState {
    value: any;
    valueChange: boolean;
    status: FormControlReadonlyStatus;
    statusChange: boolean;
}

/**
 * Defines an interface that acts as a bridge between the forms API and an element in the DOM.
 */
export interface FormControlElement {

    applyFormState(state: ApplyFormState);

    setFocus?(): Promise<void>;

    readonly formValueChangeEventName?: string;

    readonly formTouchEventName?: string;

}
