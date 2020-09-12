import {FormControlValueAccessor} from "./FormControlValueAccessor";

export class FormControl<Value = any> {

    readonly name: string;

    get accessor(): FormControlValueAccessor {
        return null;
    }

    setValue(__value: Value) {

    }

}
