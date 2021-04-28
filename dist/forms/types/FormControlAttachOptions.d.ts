import { FormValidator } from "./FormValidator";
export interface FormControlAttachOptions {
  validators?: FormValidator | FormValidator[];
  value?: any;
}
