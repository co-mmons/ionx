import {FormController, FormKnownControls} from "./FormController";

/**
 * Checks if form's dirty controls are only of given names.
 */
export function isOnlyDirty<C extends FormKnownControls = any>(controller: FormController<C>, ...controlNames: Array<keyof C | string>) {
    const {controls} = controller;
    for (const controlName in controls) {
        if (controls[controlName].dirty && !controlNames.includes(controlName)) {
            return false;
        }
    }
}
