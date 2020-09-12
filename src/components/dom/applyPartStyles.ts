export function applyPartStyles(partName: string, styles: {[key: string]: string | undefined}): (element: HTMLElement) => void;

export function applyPartStyles(element: HTMLElement, partName: string, styles: {[key: string]: string | undefined}): Promise<void>;

export function applyPartStyles(): Promise<void> | ((element: HTMLElement) => void) {

    if ("part" in HTMLElement.prototype) {
        return;
    }

    const element: HTMLElement = arguments[0] instanceof HTMLElement && arguments[0];
    const partName: string = element ? arguments[1] : arguments[0];
    const styles: {[key: string]: string | undefined} = element ? arguments[2] : arguments[1];
    const callCount: number = (element && arguments.length === 4 && arguments[3]) || 0;

    if (callCount > 50) {
        return;
    }

    if (!element) {
        return (element: HTMLElement) => applyPartStyles(element, partName, styles);
    }

    const partElement = element.shadowRoot.querySelector<HTMLElement>(`[part=${partName}]`);
    if (!partElement) {
        setTimeout(() => applyPartStyles.call(null, element, partName, styles, callCount + 1));
        return;
    }

    for (const propertyName in styles) {
        if (propertyName.startsWith("--")) {
            partElement.style.setProperty(propertyName, styles[propertyName]);
        } else {
            partElement.style[propertyName] = styles[propertyName];
        }
    }
}

