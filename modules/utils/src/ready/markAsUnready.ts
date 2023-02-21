import {ElementOrComponentWithElement} from "./ElementOrComponentWithElement";
import {readyClassName} from "./readyClassName";
import {unreadyClassName} from "./unreadyClassName";

export function markAsUnready(elementOrComponent: ElementOrComponentWithElement, partName?: string) {

    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    const wasUnready = element.classList.contains(unreadyClassName);

    if (partName) {
        element.classList.add(`${unreadyClassName}-${partName}`);
    }

    element.classList.remove(readyClassName);
    element.classList.add(unreadyClassName);

    if (!wasUnready) {
        element.dispatchEvent(new Event("readystatechange", {bubbles: true}));
    }
}
