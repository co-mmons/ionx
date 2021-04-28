const notReadySelector = "[ready=false]";
const attributeName = "ready";
export function markAsUnready(elementOrComponent) {
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    const before = element.getAttribute(attributeName);
    element.setAttribute(attributeName, "false");
    if (before === "true") {
        element.dispatchEvent(new Event("readystatechange", { bubbles: true }));
    }
}
export function markAsReady(elementOrComponent, options) {
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    if (!isReady(element)) {
        if (options === null || options === void 0 ? void 0 : options.delay) {
            setTimeout(() => setState(element, true), options.delay);
        }
        else {
            setState(element, true);
        }
    }
}
function setState(element, state) {
    element.setAttribute(attributeName, `${state}`);
    element.dispatchEvent(new Event("readystatechange", { bubbles: true }));
}
export function isReady(elementOrComponent, options) {
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    if (element.getAttribute(attributeName) === "false") {
        return false;
    }
    if (!(options === null || options === void 0 ? void 0 : options.noChildrenCheck)) {
        return isChildrenReady(element, options);
    }
    return true;
}
export function isChildrenReady(element, options) {
    if (element.querySelector(notReadySelector)) {
        return false;
    }
    if (!(options === null || options === void 0 ? void 0 : options.noShadowCheck)) {
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
            if (!checkShadowReady(children[i])) {
                return false;
            }
        }
        if (!checkShadowReady(element)) {
            return false;
        }
    }
    return true;
}
function checkShadowReady(element) {
    var _a, _b;
    if ((_a = element.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(notReadySelector)) {
        return false;
    }
    const children = (_b = element.shadowRoot) === null || _b === void 0 ? void 0 : _b.children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            if (!checkShadowReady(children[i])) {
                return false;
            }
        }
    }
    return true;
}
