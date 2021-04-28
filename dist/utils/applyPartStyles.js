export function applyPartStyles() {
    if ("part" in HTMLElement.prototype) {
        return;
    }
    const element = arguments[0] instanceof HTMLElement && arguments[0];
    const partName = element ? arguments[1] : arguments[0];
    const styles = element ? arguments[2] : arguments[1];
    const callCount = (element && arguments.length === 4 && arguments[3]) || 0;
    if (callCount > 50) {
        return;
    }
    if (!element) {
        return (element) => applyPartStyles(element, partName, styles);
    }
    const partElement = element.shadowRoot.querySelector(`[part=${partName}]`);
    if (!partElement) {
        setTimeout(() => applyPartStyles.call(null, element, partName, styles, callCount + 1));
        return;
    }
    for (const propertyName in styles) {
        if (propertyName.startsWith("--")) {
            partElement.style.setProperty(propertyName, styles[propertyName]);
        }
        else {
            partElement.style[propertyName] = styles[propertyName];
        }
    }
}
