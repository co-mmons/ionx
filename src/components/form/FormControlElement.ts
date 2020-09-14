import {FormStatus} from "./FormStatus";

/**
 * Defines an interface that acts as a bridge between the forms API and an element in the DOM.
 */
export interface FormControlElement {

    /**
     * Writes a new value to the element.
     *
     * This method is called by the forms API to write to the view
     * when programmatic changes from model to view are requested.
     */
    applyFormValue(value: any);

    applyFormStatus(status: FormStatus);

    readonly formValueChangeEventName?: string;

    readonly formTouchEventName?: string;

}
