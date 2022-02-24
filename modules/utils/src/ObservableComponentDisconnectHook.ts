import {ComponentInterface, forceUpdate} from "@stencil/core";
import {Observable, Subscription} from "rxjs";
import {ComponentDisconnectHook} from "./componentDisconnectHooks";

export class ObservableComponentDisconnectHook<Value = any> implements ComponentDisconnectHook {

    constructor(private component: ComponentInterface, observable: Observable<Value>) {
        this.subscription = observable.subscribe(value => {
            this.$error = undefined;
            this.$value = value;
            this.$valueChanged = this.$hasValue;
            this.$hasValue = true;
            this.update()

        }, error => {
            this.$error = error;
            this.update();
            this.disconnect();

        }, () => {
            this.update()
            this.disconnect()
        });
    }

    private $error: any;

    get error(): any {
        return this.$error;
    }

    private $value: Value;

    get value(): Value {
        return this.$value;
    }

    private $hasValue = false;

    get hasValue(): boolean {
        return this.$hasValue;
    }

    private $valueChanged = false;

    get valueChanged() {
        return this.$valueChanged;
    }

    private subscription: Subscription;

    private update() {
        forceUpdate(this.component);
    }

    disconnect(): void {
        this.$error = undefined;
        this.$valueChanged = false;
        this.$hasValue = false;
        this.$value = undefined;
        this.component = undefined;
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }

}
