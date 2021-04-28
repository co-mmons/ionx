import { FormControl } from "../FormControl";
import { FormValidationError } from "../FormValidationError";
export declare function required(control: FormControl): Promise<void>;
export declare class RequiredError extends FormValidationError {
  constructor();
}
