import {waitTill} from "@co.mmons/js-utils/core";
import type {Components as ionic} from "@ionic/core";
import {Component, Element, h, Host, Prop} from "@stencil/core";
import {closestElement} from "./closestElement";
import {ExtendedContent} from "./ExtendedContent";
import {LazyLoadController} from "./LazyLoadController";
import {realContainerElement} from "./realContainerElement";

@Component({
    tag: "ionx-lazy-load",
    shadow: false
})
export class LazyLoad {

    @Element()
    element: HTMLIonxLazyLoadElement;

    @Prop()
    container?: "parent" | "self" | "content";

    @Prop()
    observeShadow?: boolean;

    observers: MutationObserver[];

    connectedCallback() {
        this.initContent();
        this.initObservers();
    }

    async initObservers() {

        const container = realContainerElement(this.element);
        if (container) {
            this.observers = [new MutationObserver(mutations => this.onMutation(mutations))];
            this.observers[0].observe(container, {childList: true, subtree: true});

            if (this.observeShadow) {
                await waitTill(() => !!container.shadowRoot);

                this.observers.push(new MutationObserver(mutations => this.onMutation(mutations)));
                this.observers[1].observe(container.shadowRoot, {childList: true, subtree: true});
            }
        }

    }

    initContent() {

        const content = closestElement<HTMLElement & ionic.IonContent & ExtendedContent>(this.element, "ion-content");

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
        const content = closestElement<HTMLElement & ionic.IonContent & ExtendedContent>(this.element, "ion-content");
        if (content && content.__ionxLazyLoad) {
            content.__ionxLazyLoad.ensureLoaded();
        }
    }

    disconnectedCallback() {

        for (const observer of this.observers.splice(0, this.observers.length)) {
            observer.disconnect();
        }

        const content = closestElement<HTMLElement & ionic.IonContent & ExtendedContent>(this.element, "ion-content");
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
