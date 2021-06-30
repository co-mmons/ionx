export function closestElement<T extends HTMLElement>(node: Node, selector: string): T {

    if (!node) {
        return;
    }

    if (node instanceof ShadowRoot) {
        return closestElement(node.host, selector);
    }

    if (node instanceof HTMLElement) {
        if (node.matches(selector)) {
            return node as T;
        } else {
            return closestElement(node.parentNode, selector);
        }
    }

    return closestElement(node.parentNode, selector);
}
