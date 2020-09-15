import {Subscription} from "rxjs";
import {FormControlReadonlyState} from "./FormControlState";
import {FormControlReadonlyStatus} from "./FormControlStatus";
import {FormValidator} from "./FormValidator";

export interface FormControl<Value = any> {

    readonly name: string;

    readonly element: HTMLElement;

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

    status(): FormControlReadonlyStatus;

    state(): FormControlReadonlyState;

    onStateChange(observer: (event: {current: FormControlReadonlyState<Value>, previous: FormControlReadonlyState<Value>}) => void): Subscription;

}
