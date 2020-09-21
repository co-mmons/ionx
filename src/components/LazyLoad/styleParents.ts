import {itemCssClassPrefix} from "./cssClasses";

export function styleParents(element: Element, parents: {[parentSelector: string]: string}) {

    if (!parents) {
        return;
    }

    for (const parentSelector in parents) {
        const parent = element.closest(parentSelector);
        if (parent) {
            const prefix = parents[parentSelector] || "";

            parent.classList.remove(`${prefix}-pending`);

            for (const state of ["loading", "loaded", "error"]) {
                if (element.classList.contains(`${itemCssClassPrefix}-${state}`)) {
                    parent.classList.add(`${prefix}${state}`);
                } else {
                    parent.classList.remove(`${prefix}${state}`);
                }
            }
        }
    }
}
