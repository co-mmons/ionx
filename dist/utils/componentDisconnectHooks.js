const hooksProperty = "__disconnectHooks";
export function addComponentDisconnectHook(component, hookName, hook, options) {
    var _a;
    const existing = (_a = component[hooksProperty]) === null || _a === void 0 ? void 0 : _a[hookName];
    if ((options === null || options === void 0 ? void 0 : options.whenExists) === "persist") {
        return;
    }
    else if (existing) {
        disconnectHook(component, hookName);
    }
    if (!component[hooksProperty]) {
        Object.defineProperty(component, hooksProperty, { value: {}, enumerable: false });
        const callback = typeof component.disconnectCallback === "function" ? component.disconnectCallback : undefined;
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
    var _a;
    if (!component[hooksProperty]) {
        return;
    }
    const hook = component[hooksProperty][hookName];
    if (hook) {
        console.debug(`[ionx/componentDisconnectHooks] disconnected hook "${hookName}"`);
        delete component[hooksProperty][hookName];
        try {
            (_a = hook.disconnect) === null || _a === void 0 ? void 0 : _a.call(hook);
        }
        catch (e) {
            console.warn("[componentDisconnectHooks] error when disconnecting hook", e);
        }
    }
    return hook;
}
export function getComponentDisconnectHook(component, hookName) {
    var _a;
    return (_a = component === null || component === void 0 ? void 0 : component[hooksProperty]) === null || _a === void 0 ? void 0 : _a[hookName];
}
export function removeComponentDisconnectHook(component, hookName) {
    return disconnectHook(component, hookName);
}
