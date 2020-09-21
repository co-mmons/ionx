import {FormControl} from "../FormControl";
import {FormValidationError} from "../FormValidationError";

const emailRegexp =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validator that requires the control's value pass an email validation test.
 *
 * Tests the value using a [regular
 * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
 * pattern suitable for common usecases. The pattern is based on the definition of a valid email
 * address in the [WHATWG HTML
 * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
 * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
 * lengths of different parts of the address).
 *
 * The differences from the WHATWG version include:
 * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
 * - Disallow `local-part` to be longer than 64 characters.
 * - Disallow the whole address to be longer than 254 characters.
 *
 * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
 * validate the value against a different pattern.
 *
 * @throws InvalidEmailError
 *
 * @link https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 */
export async function validEmail(control: FormControl) {
    const value = control.value;
    if (value !== null && value !== undefined) {
        if (typeof value === "string" && (value.length === 0 || emailRegexp.test(control.value))) {
            return;
        }

        throw new InvalidEmailError();
    }
}

export class InvalidEmailError extends FormValidationError {
    constructor() {
        super()
    }

}