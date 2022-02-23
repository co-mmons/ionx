import {ComponentInterface, forceUpdate} from "@stencil/core";
import {Observable, Subscription} from "rxjs";
import {ComponentDisconnectHook} from "./componentDisconnectHooks";

export class ObservableComponentDisconnectHook implements ComponentDisconnectHook {

    constructor(private component: ComponentInterface, observable: Observable<any>) {
        this.subscription = observable.subscribe(() => this.update(), () => [this.update(), this.disconnect()], () => [this.update(), this.disconnect()]);
    }

    subscription: Subscription;

    update() {
        forceUpdate(this.component);
    }

    disconnect(): void {
        this.component = undefined;
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }

}
