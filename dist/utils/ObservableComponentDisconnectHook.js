import { forceUpdate } from "@stencil/core";
export class ObservableComponentDisconnectHook {
    constructor(component, observable) {
        this.component = component;
        this.subscription = observable.subscribe(() => this.update(), () => [this.update(), this.disconnect()], () => [this.update(), this.disconnect()]);
    }
    update() {
        forceUpdate(this.component);
    }
    disconnect() {
        this.component = undefined;
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }
}
