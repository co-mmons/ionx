import { FormControl } from "./FormControl";
import { FormController } from "./FormController";
export interface FormValidationErrorPresenter {
  present(controller: FormController, errorControl: FormControl): Promise<void>;
  dismiss(controller: FormController): Promise<void>;
}
