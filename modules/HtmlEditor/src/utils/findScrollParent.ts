export function findScrollParent(element: HTMLElement): HTMLElement {

    if (!element) {
        return;
    }

    if (element.scrollHeight >= element.clientHeight) {
        const overflowY = window.getComputedStyle(element).overflowY;
        if (overflowY !== "visible" && overflowY !== "hidden") {
            return element;
        }
    }

    if (element.assignedSlot) {
        const p = findScrollParent(element.assignedSlot.parentElement);
        if (p) {
            return p;
        }
    }

    return findScrollParent(element.parentElement);
}
