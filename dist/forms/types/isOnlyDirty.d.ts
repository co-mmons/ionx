import { FormController, FormKnownControls } from "./FormController";
/**
 * Checks if form's dirty controls are only of given names.
 */
export declare function isOnlyDirty<C extends FormKnownControls = any>(controller: FormController<C>, ...controlNames: Array<keyof C | string>): boolean;
