import {Component, ComponentInterface, Element, h, Host, Method, Prop, Watch} from "@stencil/core";
import {addEventListener, EventUnlisten} from "../dom";

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
        return this.element.querySelector<HTMLIonSearchbarElement>("ion-searchbar");
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
            setTimeout(() => this.searchbar.querySelector("input").focus(), 50);
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
