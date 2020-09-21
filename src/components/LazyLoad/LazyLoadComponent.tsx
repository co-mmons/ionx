import {Component, Host, h, Element} from "@stencil/core";
import {ExtendedContent} from "./ExtendedContent";
import {LazyLoadController} from "./LazyLoadController";

@Component({
    tag: "ionx-lazy-load",
    shadow: false
})
export class LazyLoad {

    @Element()
    element: HTMLIonxLazyLoadElement;

    observer: MutationObserver;

    connectedCallback() {
        this.observer = new MutationObserver(mutations => this.onMutation(mutations));
        this.observer.observe(this.element, {childList: true, subtree: true});
        this.initContent();
    }

    initContent() {

        const content = this.element.closest<HTMLIonContentElement & ExtendedContent>("ion-content");

        if (!content) {
            setTimeout(() => this.initContent(), 100);
        } else {

            if (!content.__ionxLazyLoad) {
                content.__ionxLazyLoad = new LazyLoadController(content);
            }

            content.__ionxLazyLoad.connectContainer(this.element);
        }
    }

    onMutation(_mutations: MutationRecord[]) {
        console.log(_mutations);
    }

    disconnectedCallback() {
        this.observer.disconnect();
        this.observer = undefined;

        const content = this.element.closest<HTMLIonContentElement & ExtendedContent>("ion-content");
        if (content && content.__ionxLazyLoad) {
            content.__ionxLazyLoad.disconnectContainer(this.element);
        }
    }

    render() {
        return <Host>
            <slot/>
        </Host>
    }
}
