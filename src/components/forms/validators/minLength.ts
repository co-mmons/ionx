import {intl} from "@co.mmons/js-intl";
import {FormControl} from "../FormControl";
import {FormValidationError} from "../FormValidationError";

export function minLength(minLength: number) {
    return async function(control: FormControl<string>) {
        const value = control.value;
        if (typeof value !== "string" || value.length < minLength) {
            throw new MinLengthError(minLength);
        }
    }
}

export class MinLengthError extends FormValidationError {
    constructor(minLength: number) {
        super(intl.message("ionx/forms#validators/MinLengthError", {length: minLength}));
    }
}
