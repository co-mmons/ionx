import {FormControl} from "./FormControl";

export interface FormValidator {

    /**
     * @throws FormValidationError
     * @param control
     */
    (control: FormControl): Promise<void>;
}
