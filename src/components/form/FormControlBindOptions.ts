import {FormValidator} from "./FormValidator";

export interface FormControlBindOptions {
    validators?: FormValidator | FormValidator[];
    value?: any;
}
