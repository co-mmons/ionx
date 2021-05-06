import {FormControl} from "./FormControl";

export interface FormControllerValidateOptions {
    preventScroll?: boolean;
    preventFocus?: boolean;

    /**
     * A function, that will be called before focusing invalid control. Can be used
     * for UI manipulation (e.g. to show tab, that contains invalid control).
     *
     * @param control Invalid control to be focused.
     */
    beforeFocus?: (control: FormControl) => void | Promise<void>;
}

export interface FormControllerPublicApi {
    validate(options?: FormControllerValidateOptions): Promise<boolean>;
}
