import {Observable} from "rxjs";
import {FormStatus} from "./FormStatus";

export interface FormControl<Value = any> {

    readonly name: string;

    readonly element: HTMLElement;

    readonly valueChanges: Observable<Value>;

    readonly statusChanges: Observable<FormStatus>;

    readonly valid: boolean;

    readonly dirty: boolean;

    readonly touched: boolean;

    readonly value: Value;

    setValue(value: Value);

    validate(): Promise<boolean>;

}
