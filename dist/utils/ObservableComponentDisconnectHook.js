import { forceUpdate } from "@stencil/core";
export class ObservableComponentDisconnectHook {
    constructor(component, observable) {
        this.component = component;
        this.$hasValue = false;
        this.$valueChanged = false;
        this.subscription = observable.subscribe(value => {
            this.$value = value;
            this.$valueChanged = this.$hasValue;
            this.$hasValue = true;
            this.update();
        }, () => [this.update(), this.disconnect()], () => [this.update(), this.disconnect()]);
    }
    get value() {
        return this.$value;
    }
    get hasValue() {
        return this.$hasValue;
    }
    get valueChanged() {
        return this.$valueChanged;
    }
    update() {
        forceUpdate(this.component);
    }
    disconnect() {
        this.$valueChanged = false;
        this.$hasValue = false;
        this.$value = undefined;
        this.component = undefined;
        this.subscription?.unsubscribe();
        this.subscription = undefined;
    }
}
