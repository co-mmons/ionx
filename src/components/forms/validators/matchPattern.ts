import {FormControl} from "../FormControl";
import {FormValidationError} from "../FormValidationError";

export function matchPattern(pattern: RegExp, message?: string) {
    return async function(control: FormControl<string>) {
        const value = control.value;
        if (typeof value !== "string" || !pattern.test(value)) {
            throw new FormValidationError(message);
        }
    }
}
