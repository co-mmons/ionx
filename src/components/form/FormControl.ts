import {Observable} from "rxjs";
import {FormStatus} from "./FormStatus";
import {FormValidator} from "./FormValidator";

export interface FormControl<Value = any> {

    readonly name: string;

    readonly element: HTMLElement;

    readonly valueChanges: Observable<Value>;

    readonly statusChanges: Observable<{current: FormStatus, previous: FormStatus}>;

    readonly valid: boolean;

    readonly invalid: boolean;

    readonly dirty: boolean;

    readonly pristine: boolean;

    readonly touched: boolean;

    readonly untouched: boolean;

    readonly disabled: boolean;

    readonly enabled: boolean;

    readonly value: Value;

    setValue(value: Value);

    enable(): void;

    disable(): void;

    markAsDirty(): void;

    markAsPristine(): void;

    markAsTouched(): void;

    markAsUntouched(): void;

    validate(): Promise<boolean>;

    setValidators(...validators: FormValidator[]);

    clearValidators(): void;

}
