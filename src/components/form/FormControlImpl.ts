import {Observable, Subject} from "rxjs";
import {addEventListener, EventUnlisten} from "../dom";
import {FormControl} from "./FormControl";
import {FormControlElement} from "./FormControlElement";

export class FormControlImpl<Value = any> implements FormControl<Value> {

    constructor(public readonly name: string) {
    }

    private element$: HTMLElement & Partial<FormControlElement>;

    get element() {
        return this.element$;
    }

    readonly valueChanges: Observable<Value> = new Subject();

    readonly statusChanges: Observable<Value> = new Subject();

    unlistenValueChange: EventUnlisten;

    setValue(value: Value) {

        if (!this.element$) {
            throw new Error("Form control not initialized, missing HTMLElement");
        }

        const tagName = this.element$.tagName.toLowerCase();

        if (tagName === "ion-input" || tagName === "ion-select" || tagName === "ion-textarea") {
            (this.element$ as HTMLIonInputElement | HTMLIonSelectElement | HTMLIonTextareaElement).value = value as any;
        } else if (tagName === "ion-checkbox") {
            (this.element$ as HTMLIonCheckboxElement).checked = !!value;
        } else if (this.element$.applyFormValue) {
            this.element$.applyFormValue(value);
        }
    }

    attach(element: HTMLElement) {

        if (this.element$ !== element) {

            if (this.element$) {
                this.detach();
            }

            this.element$ = element;

            const tagName = this.element$.tagName.toLowerCase();

            if (tagName.startsWith("ion-")) {
                this.unlistenValueChange = addEventListener(this.element$, "ionChange", ev => {
                    const detail = (ev as CustomEvent).detail;
                    this.valueChanged(detail.value);
                });
            } else if (this.element$.registerFormOnChange) {
                // this.element$.registerFormOnChange((value) => )
            }
        }

    }

    detach() {
        if (this.element$) {
            console.debug(`[ionx-form] detach control "${this.name}"`);
            this.unlistenValueChange?.();
            this.unlistenValueChange = undefined;
        }
    }

    private valueChanged(newValue: Value) {
        (this.valueChanges as Subject<Value>).next(newValue);
    }

    destroy() {
        this.detach();
        (this.valueChanges as Subject<any>).complete();
        (this.statusChanges as Subject<any>).complete();
    }

}
