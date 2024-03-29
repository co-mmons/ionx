import {Component, ComponentInterface, Element, Host, h, Method, Prop, Watch} from "@stencil/core";
import {addEventListener, EventUnlisten} from "ionx/utils";
import type {Components} from "@ionic/core/components";

@Component({
    tag: "ionx-expanding-searchbar",
    styleUrl: "ExpandingSearchbar.scss",
    scoped: true
})
export class ExpandingSearchbar implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop({reflect: true})
    expanded: boolean;

    @Method()
    async expand(): Promise<void> {
        this.expanded = true;
    }

    @Watch("expanded")
    onExpand() {
        this.applyState();
    }

    get searchbar() {
        return this.element.querySelector<HTMLElement & Components.IonSearchbar>("ion-searchbar");
    }

    onClearUnlisten: EventUnlisten;

    collapseIfPossible(cleared?: boolean) {

        if (this.expanded && (cleared || !this.searchbar.value)) {
            this.expanded = false;
        }
    }

    applyState() {
        if (this.expanded) {
            this.element.parentElement.setAttribute("ionx-expanding-searchbar-parent", "");
            setTimeout(() => this.searchbar.setFocus(), 50);
        } else {
            this.element.parentElement.removeAttribute("ionx-expanding-searchbar-parent");
            setTimeout(() => this.searchbar.querySelector("input").blur(), 50);
        }
    }

    componentWillLoad() {
        this.applyState();
    }

    connectedCallback() {
        this.onClearUnlisten = addEventListener(this.searchbar, "ionClear", () => this.collapseIfPossible(true));
    }

    disconnectedCallback() {
        this.onClearUnlisten?.();
    }

    render() {
        return <Host>
            <ionx-expanding-searchbar-parent/>
            <slot/>
        </Host>;
    }
}
