import {FormControl} from "../FormControl";
import {RequiredError} from "./required";

export async function requiredTrue(control: FormControl) {

    const value = control.value;
    if (value !== true) {
        throw new RequiredError();
    }

}
