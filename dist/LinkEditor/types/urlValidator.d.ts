import { FormControl, FormValidationError } from "ionx/forms";
/**
 * @throws InvalidUrlError
 */
export declare function urlValidator(control: FormControl): Promise<void>;
export declare class InvalidUrlError extends FormValidationError {
  constructor();
}
