const hooksProperty = "__disconnectHooks";
export function addComponentDisconnectHook(component, hookName, hook, options) {
    const existing = component[hooksProperty]?.[hookName];
    if (options?.whenExists === "persist") {
        return;
    }
    else if (existing) {
        disconnectHook(component, hookName);
    }
    if (!component[hooksProperty]) {
        Object.defineProperty(component, hooksProperty, { value: {}, enumerable: false });
        const callback = typeof component.disconnectedCallback === "function" ? component.disconnectedCallback : undefined;
        component.disconnectedCallback = () => {
            if (callback) {
                callback.call(component);
            }
            for (const hookName in component[hooksProperty]) {
                disconnectHook(component, hookName);
            }
        };
    }
    component[hooksProperty][hookName] = hook;
}
function disconnectHook(component, hookName) {
    if (!component[hooksProperty]) {
        return;
    }
    const hook = component[hooksProperty][hookName];
    if (hook) {
        console.debug(`[ionx/componentDisconnectHooks] disconnected hook "${hookName}"`);
        delete component[hooksProperty][hookName];
        try {
            hook.disconnect?.();
        }
        catch (e) {
            console.warn("[componentDisconnectHooks] error when disconnecting hook", e);
        }
    }
    return hook;
}
export function getComponentDisconnectHook(component, hookName) {
    return component?.[hooksProperty]?.[hookName];
}
export function removeComponentDisconnectHook(component, hookName) {
    return disconnectHook(component, hookName);
}
