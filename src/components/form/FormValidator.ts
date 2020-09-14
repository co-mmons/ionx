import {FormControl} from "./FormControl";

export interface FormValidatorOptions {
    /**
     * What action triggered validator. You can check for that option if your custom validator
     * should be triggered only when you manually calling validate function.
     */
    trigger: "valueChange" | "validate";
}

export interface FormValidator {

    /**
     * @throws FormValidationError
     * @param control
     * @param options Additional options for validator.
     */
    (control: FormControl, options?: FormValidatorOptions): Promise<void>;
}
