import { unreadyClassName } from "./unreadyClassName";
export function isReady(elementOrComponent, options) {
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    if (element.classList.contains(unreadyClassName)) {
        return false;
    }
    if (!options?.noChildrenCheck) {
        return isChildrenReady(element, options);
    }
    return true;
}
export function isChildrenReady(elementOrComponent, options) {
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    if (element.querySelector(`.${unreadyClassName}`)) {
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
    if (element.shadowRoot?.querySelector(`.${unreadyClassName}`)) {
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
