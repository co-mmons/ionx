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
        if (options?.delay) {
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
    if (!options?.noChildrenCheck) {
        return isChildrenReady(element, options);
    }
    return true;
}
export function isChildrenReady(element, options) {
    if (element.querySelector(notReadySelector)) {
        return false;
    }
    if (!options?.noShadowCheck) {
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
    if (element.shadowRoot?.querySelector(notReadySelector)) {
        return false;
    }
    const children = element.shadowRoot?.children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            if (!checkShadowReady(children[i])) {
                return false;
            }
        }
    }
    return true;
}
