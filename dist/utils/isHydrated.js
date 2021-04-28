import { hydratablePrefixes, hydratableTagNames } from "./hydratables";
const notHydratedSelector = ":not(.hydrated):not(div):not(span):not(slot):not(a):not(img):not(input)";
export function isHydrated(element, options) {
    if (!element) {
        return true;
    }
    if (isHydratable(element) && !element.classList.contains("hydrated")) {
        return false;
    }
    if (!(options === null || options === void 0 ? void 0 : options.noChildrenCheck)) {
        return isChildrenHydrated(element, options);
    }
    return true;
}
export function isChildrenHydrated(element, options) {
    if (!element) {
        return true;
    }
    const children = element.querySelectorAll(notHydratedSelector);
    for (let i = 0; i < children.length; i++) {
        if (isHydratable(children[i])) {
            return false;
        }
    }
    if (!(options === null || options === void 0 ? void 0 : options.noShadowCheck)) {
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
function checkShadowHydrated(element) {
    var _a;
    const shadowChildren = (_a = element.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(notHydratedSelector);
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
function isHydratable(element) {
    if (!element) {
        return false;
    }
    const tagName = element.tagName;
    if (hydratableTagNames.includes(tagName)) {
        return true;
    }
    else {
        for (const prefix of hydratablePrefixes) {
            if (tagName.startsWith(prefix)) {
                return true;
            }
        }
    }
    return false;
}
