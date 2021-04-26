export function scrollIntoView(element: HTMLElement, parent: HTMLElement) {

    if (parent) {

        const parentRect = parent.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        if (!(rect.top > parentRect.top && rect.top <= parentRect.bottom && rect.bottom < parentRect.height)) {

            let top = element.offsetTop - 100;

            if (element.offsetParent) {
                let offsetParent = element.offsetParent as HTMLElement;
                while (offsetParent !== parent && !!offsetParent) {
                    top += offsetParent.offsetTop;
                    offsetParent = offsetParent.offsetParent as HTMLElement;
                }
            }

            parent.scrollTo({top: top});
        }

        return;
    }

    element.scrollIntoView();
}
