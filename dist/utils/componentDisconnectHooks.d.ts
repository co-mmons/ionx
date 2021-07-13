import { ComponentInterface } from "@stencil/core";
interface DisconnectHookOptions {
    whenExists?: "persist" | "replace";
}
export interface ComponentDisconnectHook {
    disconnect: () => void;
}
export declare function addComponentDisconnectHook(component: ComponentInterface, hookName: string, hook: ComponentDisconnectHook, options?: DisconnectHookOptions): void;
export declare function getComponentDisconnectHook<T extends ComponentDisconnectHook>(component: ComponentInterface, hookName: string): T;
export declare function removeComponentDisconnectHook<T extends ComponentDisconnectHook>(component: ComponentInterface, hookName: string): T;
export {};
