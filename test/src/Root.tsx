import {Component, Host, h} from "@stencil/core";
import "@ionic/core";
import {ALALAL} from "ionx/html-editor";

const tests = [
    "date-time",
    "dialog",
    "expanding-searchbar",
    "form",
    "lazy-load",
    "loading",
    "multi-grid",
    "select",
    "tags-input",
    "virtual-scroll",
    "link-editor"
];

@Component({
    tag: "ionx-test-root"
})
export class Root {

    render() {
        console.log(ALALAL);
        return <Host>

            <ionx-html-editor/>

            <ion-router useHash={false}>
                <ion-route url="/" component="ionx-test-home"/>
                {tests.map(test => <ion-route url={`/${test}`} component={`ionx-test-${test}`}/>)}
            </ion-router>

            <ion-split-pane content-id="app-nav">

                <ion-menu content-id="app-nav">
                    <ion-list>
                        {tests.map(test => <ion-item href={`/${test}`}>
                            <ion-label>{test}</ion-label>
                        </ion-item>)}
                    </ion-list>
                </ion-menu>

                <ion-nav id="app-nav"/>

            </ion-split-pane>

        </Host>;
    }

}
