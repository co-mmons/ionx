export function realContainerElement(lazy: HTMLIonxLazyLoadElement): HTMLElement {

    if (lazy.container === "parent") {

        if (lazy.parentNode instanceof ShadowRoot) {
            return lazy.parentNode.host as HTMLElement;
        }

        return lazy.parentElement;

    } else if (lazy.container === "self") {
        return lazy;
    }

}
