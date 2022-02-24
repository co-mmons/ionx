import { unreadyClassName } from "./unreadyClassName";
export function markAsUnready(elementOrComponent, partName) {
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    const wasUnready = element.classList.contains(unreadyClassName);
    if (partName) {
        element.classList.add(`${unreadyClassName}-${partName}`);
    }
    element.classList.add(unreadyClassName);
    if (!wasUnready) {
        element.dispatchEvent(new Event("readystatechange", { bubbles: true }));
    }
}
