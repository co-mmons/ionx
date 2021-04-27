import {intl} from "@co.mmons/js-intl";
import {FormControl} from "../FormControl";
import {FormValidationError} from "../FormValidationError";

export async function required(control: FormControl) {

    const value = control.value;
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        throw new RequiredError();
    }

}

export class RequiredError extends FormValidationError {
    constructor() {
        super(intl.message`ionx/forms#RequiredError|message`);
    }
}
