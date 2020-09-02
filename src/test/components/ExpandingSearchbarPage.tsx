import {intl} from "@co.mmons/js-intl";
import {Component, Host, h} from "@stencil/core";

@Component({
    tag: "ionx-test-expanding-searchbar",
    shadow: false
})
export class ExpandingSearchbarPage {

    render() {

        let searchbar: HTMLIonxExpandingSearchbarElement;

        return <Host>
            <ion-header>
                <ion-toolbar>
                    <ion-title>Searchbar</ion-title>

                    <ionx-expanding-searchbar ref={el => searchbar = el}>
                        <ion-searchbar ionx-searchbar-flat placeholder={intl.message`@co.mmons/js-intl#Search for...`}/>
                    </ionx-expanding-searchbar>

                    <ion-buttons slot="end">
                        <ion-button fill="clear" onClick={() => searchbar.expand()}>
                            <ion-icon name="search"/>
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>
        </Host>
    }
}
