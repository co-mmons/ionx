import {waitTill} from "@co.mmons/js-utils/core";
import type {Components as ionic} from "@ionic/core";
import {getMode} from "@ionic/core";
import {Component, Element, h, Host, Prop, Watch} from "@stencil/core";
import {openUrl} from "ionx/Router";
import {addEventListener, EventUnlisten} from "ionx/utils";
import {WidthBreakpointsContainer} from "ionx/WidthBreakpoints";
import {ToolbarButtonType} from "./ToolbarButtonType";
import {ToolbarTitleWrap} from "./ToolbarTitleWrap";

@Component({
    tag: "ionx-toolbar",
    styleUrl: "Toolbar.scss",
    scoped: true
})
export class Toolbar {

    @Element()
    element: HTMLElement;

    @Prop()
    button!: ToolbarButtonType;

    @Prop()
    buttonIcon: string;

    @Prop()
    buttonHandler: () => void;

    @Prop()
    defaultBackHref: string;

    @Prop()
    titleVisible: boolean = true;

    @Prop()
    titleWrap: ToolbarTitleWrap = false;

    @Watch("titleWrap")
    titleWrapChanged(niu: ToolbarTitleWrap, old: ToolbarTitleWrap) {
        if (niu !== old) {
            if (niu !== "collapse") {
                this.disableCollapsibleTitle();
            } else {
                this.enableCollapsibleTitle();
            }
        }
    }

    breakpoints: WidthBreakpointsContainer;

    toolbarElement: HTMLElement;

    get contentElement() {
        return this.element.closest("ion-header")?.parentElement?.querySelector<HTMLElement & ionic.IonContent>("ion-content");
    }

    unlistenScroll: EventUnlisten;

    async contentScrolled(scrollElement: HTMLElement) {

        if (!scrollElement) {
            scrollElement = await this.contentElement?.getScrollElement();
        }

        if (!scrollElement) {
            this.disableCollapsibleTitle();
            return;
        }

        if (!this.toolbarElement) {
            return;
        }

        const toolbarHeight = 56;
        const scrollTop = scrollElement.scrollTop;

        if (scrollTop < 100) {
            this.toolbarElement.style.maxHeight = null;
            this.element.classList.remove("ionx--title-collapsed");
        } else if (scrollTop > 100 + toolbarHeight) {
            this.toolbarElement.style.maxHeight = `${toolbarHeight}px`;
            this.element.classList.add("ionx--title-collapsed");
        } else {
            this.element.classList.remove("ionx--title-collapsed");
            this.toolbarElement.style.maxHeight = `${(toolbarHeight * 2) + 100 - scrollTop}px`;
        }
    }

    async enableCollapsibleTitle() {

        if (!this.unlistenScroll) {

            let content: HTMLElement & ionic.IonContent;
            try {
                await waitTill(() => !!(content = this.contentElement), undefined, 10000);
            } catch {
            }

            if (content) {
                content.scrollEvents = true;
                this.unlistenScroll = addEventListener(content, "ionScroll", (ev: CustomEvent) => this.contentScrolled((ev.detail.event.target || ev.detail.event.path?.[0]) as HTMLElement));
                this.contentScrolled(await content.getScrollElement());
            }
        }

    }

    disableCollapsibleTitle() {
        if (this.unlistenScroll) {
            this.unlistenScroll();
            this.unlistenScroll = undefined;

            if (this.toolbarElement) {
                this.toolbarElement.style.maxHeight = null;
            }

            this.element.classList.remove("ionx--title-collapsed");
        }
    }

    dismissOverlay() {

        const modal = this.element.closest<HTMLIonModalElement>("ion-modal");
        if (modal) {
            modal.dismiss();
            return;
        }

        const popover = this.element.closest<HTMLIonPopoverElement>("ion-popover");
        if (popover) {
            popover.dismiss();
            return;
        }
    }

    async buttonClicked(ev: Event) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.button === "close") {
            if (this.buttonHandler) {
                this.buttonHandler()
            }

            this.dismissOverlay();

        } else if (this.button === "back") {
            const nav = this.element.closest("ion-nav");

            if (nav && await nav.canGoBack()) {
                const router = !nav.swipeGesture && document.querySelector("ion-router");

                if (router && !nav.closest("[no-router]")) {
                    const canTransition = await router.canTransition();
                    if (canTransition === true) {
                        // @ts-ignore
                        return await router.back(true);
                    }
                }

                return nav.pop({skipIfBusy: true});
            }

            return openUrl(this.defaultBackHref, "back");
        }
    }

    connectedCallback() {

        this.breakpoints = new WidthBreakpointsContainer(this.element);

        if (this.titleWrap === "collapse") {
            this.enableCollapsibleTitle();
        }
    }

    disconnectedCallback() {
        this.disableCollapsibleTitle();
        this.toolbarElement = undefined;

        this.breakpoints.disconnect();
        this.breakpoints = undefined;
    }

    render() {

        const mode = getMode();

        return <Host class={{"ionx--title-wrap": typeof this.titleWrap === "boolean" ? this.titleWrap : this.titleWrap === "collapse"}}>
            <ion-toolbar ref={el => this.toolbarElement = el}>

                {this.button === "menu" && <ion-menu-button slot="start"/>}

                {(this.button === "back" || this.button === "close") && <ion-button
                    class="back-close-button"
                    slot="start"
                    fill="clear"
                    onClick={ev => this.buttonClicked(ev)}>
                    <ion-icon name={this.button === "close" ? "close" : (mode === "ios" ? "chevron-back" : "arrow-back")} slot="icon-only"/>
                </ion-button>}

                <div ionx--inner class={{"ionx--no-button": this.button === "none"}}>

                    <ion-buttons>
                        <slot name="action"/>
                    </ion-buttons>

                    <h1 style={{display: this.titleVisible ? null : "none"}}>
                        <slot name="title"/>
                        <slot name="subtitle"/>
                    </h1>

                </div>

                <slot/>

            </ion-toolbar>
        </Host>;

    }
}
