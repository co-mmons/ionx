import { FormControl } from "../FormControl";
import { FormValidationError } from "../FormValidationError";
export declare function minLength(minLength: number): (control: FormControl<string>) => Promise<void>;
export declare class MinLengthError extends FormValidationError {
  constructor(minLength: number);
}
