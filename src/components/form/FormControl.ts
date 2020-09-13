import {Observable} from "rxjs";

export interface FormControl<Value = any> {

    readonly name: string;

    readonly element: HTMLElement;

    readonly valueChanges: Observable<Value>;

    readonly statusChanges: Observable<Value>;

    setValue(value: Value);

}
