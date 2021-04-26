import {caretTopPoint} from "./caretToPoint";

export function scrollToCaret(parent: HTMLElement) {

    if (parent) {

        const parentRect = parent.getBoundingClientRect();
        const rect = caretTopPoint();
        rect.top -= 100;

        if (!(rect.top > parentRect.top && rect.top <= parentRect.bottom)) {

            let top = rect.top - parentRect.top;
            parent.scrollTo({top: top, behavior: "auto"});
        }

        return;
    }

}
