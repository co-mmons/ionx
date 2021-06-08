import { FormControl } from "../FormControl";
import { FormValidationError } from "../FormValidationError";
/**
 * Validator that requires the control's value pass an email validation test.
 * @throws InvalidEmailError
 * @link https://github.com/angular/angular/blob/master/packages/forms/src/validators.ts
 * @link https://github.com/manishsaraan/email-validator/blob/master/index.js
 */
export declare function validEmail(control: FormControl): Promise<void>;
export declare class InvalidEmailError extends FormValidationError {
  constructor();
}
