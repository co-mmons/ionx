import { readyClassName } from "./readyClassName";
import { unreadyClassName } from "./unreadyClassName";
export function markAsReady() {
    const elementOrComponent = arguments[0];
    const partName = typeof arguments[1] === "string" ? arguments[1] : undefined;
    const options = typeof arguments[1] === "object" ? arguments[1] : (typeof arguments[2] === "object" ? arguments[2] : undefined);
    const element = elementOrComponent instanceof Element ? elementOrComponent : elementOrComponent.element;
    const { classList } = element;
    const wasReady = classList.contains(readyClassName);
    const doMark = () => {
        let mayReady = true;
        if (partName) {
            classList.remove(`${unreadyClassName}-${partName}`);
            classList.forEach(v => v.startsWith(`${unreadyClassName}-`) && (mayReady = false));
        }
        else {
            classList.forEach(v => v.startsWith(`${unreadyClassName}-`) && classList.remove(v));
            mayReady = true;
        }
        if (!wasReady && mayReady) {
            classList.remove(unreadyClassName);
            classList.add(readyClassName);
            if (!wasReady) {
                element.dispatchEvent(new Event("readystatechange", { bubbles: true }));
            }
        }
    };
    if (options?.delay > 0) {
        setTimeout(doMark, options.delay);
    }
    else {
        doMark();
    }
}
