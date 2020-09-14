import {Observable} from "rxjs";
import {FormControlState} from "./FormControlState";
import {FormControlStatus} from "./FormControlStatus";
import {FormValidator} from "./FormValidator";

export interface FormControl<Value = any> {

    readonly name: string;

    readonly element: HTMLElement;

    readonly valueChanges: Observable<Value>;

    readonly statusChanges: Observable<{current: FormControlStatus, previous: FormControlStatus}>;

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

    focus(options?: FocusOptions): void;

    enable(): void;

    disable(): void;

    markAsDirty(): void;

    markAsPristine(): void;

    markAsTouched(): void;

    markAsUntouched(): void;

    validate(): Promise<boolean>;

    setValidators(...validators: FormValidator[]);

    clearValidators(): void;

    status(): FormControlStatus;

    state(): FormControlState;

}
