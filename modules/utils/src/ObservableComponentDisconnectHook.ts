import {ComponentInterface, forceUpdate} from "@stencil/core";
import {Observable, Subscription} from "rxjs";
import {ComponentDisconnectHook} from "./componentDisconnectHooks";

export class ObservableComponentDisconnectHook implements ComponentDisconnectHook {

    constructor(private component: ComponentInterface, observable: Observable<any>) {
        this.subscription = observable.subscribe(value => {
            this.$value = value;
            this.$valueChanged = this.$hasValue;
            this.$hasValue = true;
            this.update()
        }, () => [this.update(), this.disconnect()], () => [this.update(), this.disconnect()]);
    }

    private $value: any;

    get value(): any {
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
        this.$valueChanged = false;
        this.$hasValue = false;
        this.$value = undefined;
        this.component = undefined;
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }

}
