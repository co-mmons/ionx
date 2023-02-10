import {intl} from "@co.mmons/js-intl";
import {popoverController} from "@ionic/core/components";
import {defineCustomElement as definePopover} from "@ionic/core/components/ion-popover";
import {defineCustomElement as defineSearchbar} from "@ionic/core/components/ion-searchbar";
import {defineCustomElement as defineFooter} from "@ionic/core/components/ion-footer";
import {defineCustomElement as defineToolbar} from "@ionic/core/components/ion-toolbar";
import {defineCustomElement as defineButton} from "@ionic/core/components/ion-button";
import {Component, Element, h, Host, Listen, Prop} from "@stencil/core";

definePopover();
defineSearchbar();
defineFooter();
defineToolbar();
defineButton();

@Component({
    tag: "ionx-data-table-search-filter",
    shadow: true,
    styleUrl: "SearchPopover.scss"
})
export class SearchPopover {

    @Element()
    element: HTMLElement;

    @Prop()
    value: string;

    cancel() {
        popoverController.dismiss();
    }

    ok() {
        popoverController.dismiss(this.element.shadowRoot.querySelector("ion-searchbar").value, "ok");
    }

    @Listen("ionViewDidEnter")
    didEnter() {
        this.element.shadowRoot.querySelector("ion-searchbar").setFocus();
    }

    render() {
        return <Host>

            <ion-searchbar
                type="text"
                value={this.value}
                enterkeyhint="search"
                inputmode="search"
                spellcheck={false}
                placeholder={intl.message`@co.mmons/js-intl#Search for...`}
                onKeyDown={ev => ev.key === "Enter" ? this.ok() : undefined}/>

            <ion-footer>
                <ion-toolbar>

                    <div>

                        <ion-button size="small" fill="clear" onClick={() => this.cancel()}>{intl.message`@co.mmons/js-intl#Cancel`}</ion-button>

                        <ion-button size="small" fill="clear" onClick={() => this.ok()}>{intl.message`@co.mmons/js-intl#Ok`}</ion-button>

                    </div>

                </ion-toolbar>
            </ion-footer>
        </Host>
    }
}
