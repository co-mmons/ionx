import { ComponentInterface } from "@stencil/core";
import { Observable, Subscription } from "rxjs";
import { ComponentDisconnectHook } from "./componentDisconnectHooks";
export declare class ObservableComponentDisconnectHook implements ComponentDisconnectHook {
    private component;
    constructor(component: ComponentInterface, observable: Observable<any>);
    subscription: Subscription;
    update(): void;
    disconnect(): void;
}
