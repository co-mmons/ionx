import {ComponentInterface} from "@stencil/core";

interface DisconnectHookOptions {
    whenExists?: "persist" | "replace";
}

const hooksProperty = "__disconnectHooks";

export interface ComponentDisconnectHook {
    disconnect: () => void;
}

export function addComponentDisconnectHook(component: ComponentInterface, hookName: string, hook: ComponentDisconnectHook, options?: DisconnectHookOptions) {

    const existing = component[hooksProperty]?.[hookName];

    if (options?.whenExists === "persist") {
        return;
    } else if (existing) {
        disconnectHook(component, hookName);
    }

    if (!component[hooksProperty]) {
        Object.defineProperty(component, hooksProperty, {value: {}, enumerable: false});

        const callback: () => void = typeof component.disconnectedCallback === "function" ? component.disconnectedCallback : undefined;

        component.disconnectedCallback = () => {

            if (callback) {
                callback.call(component);
            }

            for (const hookName in component[hooksProperty]) {
                disconnectHook(component, hookName);
            }
        }
    }

    component[hooksProperty][hookName] = hook;
}

function disconnectHook(component: ComponentInterface, hookName: string) {

    if (!component[hooksProperty]) {
        return;
    }

    const hook: ComponentDisconnectHook = component[hooksProperty][hookName];
    if (hook) {
        console.debug(`[ionx/componentDisconnectHooks] disconnected hook "${hookName}"`);

        delete component[hooksProperty][hookName];
        try {
            hook.disconnect?.();
        } catch (e) {
            console.warn("[componentDisconnectHooks] error when disconnecting hook", e);
        }
    }

    return hook;
}

export function getComponentDisconnectHook<T extends ComponentDisconnectHook>(component: ComponentInterface, hookName: string): T {
    return component?.[hooksProperty]?.[hookName];
}

export function removeComponentDisconnectHook<T extends ComponentDisconnectHook>(component: ComponentInterface, hookName: string): T {
    return disconnectHook(component, hookName) as T;
}
