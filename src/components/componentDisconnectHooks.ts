import {ComponentInterface} from "@stencil/core";

interface DisconnectHookOptions {
    whenExists?: "persist" | "replace";
}

const hooksProperty = "__disconnectHooks";

export interface ComponentDisconnectHook {
    disconnect: () => void;
}

export function addComponentDisconnectHook(component: any, hookName: string, hook: ComponentDisconnectHook, options?: DisconnectHookOptions) {

    const existing = component[hooksProperty]?.[hookName];

    if (options?.whenExists === "persist") {
        return;
    } else if (existing) {
        disconnectHook(component, hookName);
    }

    if (!component[hooksProperty]) {
        Object.defineProperty(component, hooksProperty, {value: {}, enumerable: false});

        const callback: () => void = typeof component.disconnectCallback === "function" ? component.disconnectCallback : undefined;

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
    const hook = component[hooksProperty][hookName];
    if (hook) {
        console.debug(`[ionx/componentDisconnectHooks] disconnected hook "${hookName}"`);

        delete component[hooksProperty][hookName];
        try {
            hook.disconnect?.();
        } catch (e) {
            console.warn("[componentDisconnectHooks] error when disconnecting hook", e);
        }
    }
}

export function getComponentDisconnectHook<T extends ComponentDisconnectHook>(component: ComponentInterface, hookName: string): T {
    return component?.[hooksProperty]?.[hookName];
}
