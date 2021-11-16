import { FormControl } from "./FormControl";
export interface FormControllerValidateOptions {
  preventScroll?: boolean;
  preventFocus?: boolean;
  /**
   * Choose which invalid control is to be focused:
   * * firstElement - first control (ordered by DOM appearance) that has element attached
   * * first - first control (no matter if has or hasn't element)
   * * pass you own function and choose control that is to be focused
   *
   * By default is "firstElement".
   */
  focusableControl?: "firstElement" | "first" | ((controls: FormControl[]) => FormControl | Promise<FormControl>);
  /**
   * If controller should wait for element to be attached if invalid control to be focused doesn't have an element.
   * True of false or milliseconds of how long it should wait.
   */
  waitForFocusElement?: boolean | number;
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
