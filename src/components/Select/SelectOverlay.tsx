import {intl} from "@co.mmons/js-intl";
import {Component, Element, h, Host, Prop} from "@stencil/core";
import {matchedMediaBreakpoint} from "../dom/matchedMediaBreakpoints";
import {SelectOption} from "./SelectOption";

@Component({
    tag: "ionx-select-overlay",
    shadow: true,
    styleUrl: "SelectOverlay.scss"
})
export class SelectOverlay {

    @Element()
    element: HTMLElement;

    @Prop()
    overlay!: "modal" | "popover";

    @Prop()
    overlayTitle: string;

    @Prop()
    options: SelectOption[];

    @Prop()
    values: any[];

    cancel() {

        if (this.overlay === "modal") {
            const modal = this.element.closest<HTMLIonModalElement>("ion-modal");
            modal.dismiss(undefined, "cancel");
        }

    }

    render() {

        return <Host>

            {this.overlay === "modal" && <ion-header>
                <ion-toolbar>

                    <ion-back-button
                        style={{display: "inline-block"}}
                        icon={matchedMediaBreakpoint(this, "md") ? "close" : null}
                        onClick={ev => [ev.preventDefault(), this.cancel()]}
                        slot="start"/>

                    <ion-title style={{padding: "0px"}}>{this.overlayTitle}</ion-title>

                    <ion-buttons slot="end">
                        <ion-button fill="clear">{intl.message`@co.mmons/js-intl#Done`}</ion-button>
                    </ion-buttons>

                </ion-toolbar>
            </ion-header>}

            <ion-content scrollY={false} scrollX={false}>

            </ion-content>

        </Host>
    }

}
