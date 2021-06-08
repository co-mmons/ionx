import {FormControl} from "../FormControl";
import {FormValidationError} from "../FormValidationError";

const emailRegexp = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

/**
 * Validator that requires the control's value pass an email validation test.
 * @throws InvalidEmailError
 * @link https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 * @link https://github.com/manishsaraan/email-validator/blob/master/index.js
 */
export async function validEmail(control: FormControl) {
    const value = control.value;

    if (!value) {
        return;
    }

    IS_VALID: {

        const emailParts = value.split("@");
        if (emailParts.length !== 2) {
            break IS_VALID;
        }

        const account = emailParts[0];
        const address = emailParts[1];

        if (account.length > 64 || address.length > 255) {
            break IS_VALID;
        }

        const domainParts = address.split(".");
        if (domainParts.find(part => part.length > 63)) {
            break IS_VALID;
        }

        if (!emailRegexp.test(value)) {
            break IS_VALID;
        }

        // now we are sure the email is valid!
        return;
    }

    throw new InvalidEmailError();
}

export class InvalidEmailError extends FormValidationError {
    constructor() {
        super()
    }

}
