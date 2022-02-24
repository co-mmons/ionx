import {ElementOrComponentWithElement} from "./ElementOrComponentWithElement";
import {unreadyClassName} from "./unreadyClassName";

export function isReady(elementOrComponent: ElementOrComponentWithElement, options?: {noChildrenCheck?: boolean, noShadowCheck?: boolean}) {

    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;

    if (element.classList.contains(unreadyClassName)) {
        return false;
    }

    if (!options?.noChildrenCheck) {
        return isChildrenReady(element, options);
    }

    return true;
}

export function isChildrenReady(elementOrComponent: ElementOrComponentWithElement, options?: {noShadowCheck?: boolean}) {

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

function checkShadowReady(element: Element) {

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
