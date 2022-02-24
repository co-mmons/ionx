import { ComponentInterface } from "@stencil/core";
import { Observable } from "rxjs";
import { ComponentDisconnectHook } from "./componentDisconnectHooks";
export declare class ObservableComponentDisconnectHook<Value = any> implements ComponentDisconnectHook {
    private component;
    constructor(component: ComponentInterface, observable: Observable<Value>);
    private $error;
    get error(): any;
    private $value;
    get value(): Value;
    private $hasValue;
    get hasValue(): boolean;
    private $valueChanged;
    get valueChanged(): boolean;
    private subscription;
    private update;
    disconnect(): void;
}
