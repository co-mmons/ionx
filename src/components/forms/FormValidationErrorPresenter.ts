import {FormControl} from "./FormControl";
import {FormControllerImpl} from "./FormControllerImpl";

export interface FormValidationErrorPresenter {
    present(controller: FormControllerImpl, errorControl: FormControl): Promise<void>;
    dismiss(controller: FormControllerImpl): Promise<void>;
}
