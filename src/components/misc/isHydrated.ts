import {hydratablePrefixes, hydratableTagNames} from "./hydratables";
import {IsHydratedOptions} from "./IsHydratedOptions";

const notHydratedSelector = ":not(.hydrated):not(div):not(span):not(slot):not(a):not(img):not(input)";

export function isHydrated(element: Element, options?: IsHydratedOptions) {

    if (!element) {
        return true;
    }

    if (isHydratable(element) && !element.classList.contains("hydrated")) {
        return false;
    }

    if (!options?.noChildrenCheck) {
        return isChildrenHydrated(element, options);
    }

    return true;
}

export function isChildrenHydrated(element: Element, options?: {noShadowCheck?: boolean}) {

    if (!element) {
        return true;
    }

    const children = element.querySelectorAll(notHydratedSelector);

    for (let i = 0; i < children.length; i++) {
        if (isHydratable(children[i])) {
            return false;
        }
    }

    if (!options?.noShadowCheck) {
        for (let i = 0; i < children.length; i++) {
            if (!checkShadowHydrated(children[i])) {
                return false;
            }
        }

        if (!checkShadowHydrated(element)) {
            return false;
        }
    }

    return true;
}

function checkShadowHydrated(element: Element) {

    const shadowChildren = element.shadowRoot?.querySelectorAll(notHydratedSelector);

    if (shadowChildren) {
        for (let i = 0; i < shadowChildren.length; i++) {
            if (isHydratable(shadowChildren[i])) {
                return false;
            }
        }

        for (let i = 0; i < shadowChildren.length; i++) {
            if (!checkShadowHydrated(shadowChildren[i])) {
                return false;
            }
        }
    }

    return true;
}

function isHydratable(element: Element) {

    if (!element) {
        return false;
    }

    const tagName = element.tagName;
    if (hydratableTagNames.includes(tagName)) {
        return true;
    } else {
        for (const prefix of hydratablePrefixes) {
            if (tagName.startsWith(prefix)) {
                return true;
            }
        }
    }

    return false;
}
