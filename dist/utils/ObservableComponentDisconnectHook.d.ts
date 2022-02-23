import { ComponentInterface } from "@stencil/core";
import { Observable } from "rxjs";
import { ComponentDisconnectHook } from "./componentDisconnectHooks";
export declare class ObservableComponentDisconnectHook implements ComponentDisconnectHook {
    private component;
    constructor(component: ComponentInterface, observable: Observable<any>);
    private $value;
    get value(): any;
    private $hasValue;
    get hasValue(): boolean;
    private $valueChanged;
    get valueChanged(): boolean;
    private subscription;
    private update;
    disconnect(): void;
}
