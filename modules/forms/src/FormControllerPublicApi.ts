export interface FormControllerValidateOptions {
    preventScroll?: boolean;
    preventFocus?: boolean;
}

export interface FormControllerPublicApi {
    validate(options?: FormControllerValidateOptions): Promise<boolean>;
}
