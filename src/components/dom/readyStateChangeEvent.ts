const notReadySelector = "[ready=false]";
const attributeName = "ready";

export function markAsUnready(elementOrComponent: Element | {element: Element}) {

    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;

    const before = element.getAttribute(attributeName);
    element.setAttribute(attributeName, "false");

    if (before === "true") {
        element.dispatchEvent(new Event("readystatechange",{bubbles: true}));
    }
}

export function markAsReady(elementOrComponent: Element | {element: Element}, options?: {delay?: number}) {
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    if (!isReady(element)) {
        if (options?.delay) {
            setTimeout(() => setState(element, true), options.delay);
        } else {
            setState(element, true);
        }
    }
}

function setState(element: Element, state: boolean) {
    element.setAttribute(attributeName, `${state}`);
    element.dispatchEvent(new Event("readystatechange", {bubbles: true}));
}

export function isReady(elementOrComponent: Element | {element: Element}, options?: {noChildrenCheck?: boolean, noShadowCheck?: boolean}) {

    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;

    if (element.getAttribute(attributeName) === "false") {
        return false;
    }

    if (!options?.noChildrenCheck) {
        return checkChildrenReady(element, options);
    }

    return true;
}

export function checkChildrenReady(element: Element, options?: {noShadowCheck?: boolean}) {

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

function checkShadowReady(element: Element) {

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
