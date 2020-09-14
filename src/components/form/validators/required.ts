import {FormControl} from "../FormControl";
import {FormValidationError} from "../FormValidationError";

export async function required(control: FormControl) {

    const value = control.value;
    if (value === undefined || value === null || value === "") {
        throw new RequiredError();
    }

}

export class RequiredError extends FormValidationError {
    constructor() {
        super("Field is required");
    }
}
