import {intl} from "@co.mmons/js-intl";
import ExtendableError from "ts-error";

export class FormValidationError extends ExtendableError {
    constructor(message?: string) {
        super(message ? message : intl.message`ionx/forms#validators/InvalidValueError`);
    }
}
