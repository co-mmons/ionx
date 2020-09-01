import {Component, h} from "@stencil/core";

@Component({
    tag: "ionx-test-dialog"
})
export class DialogTestPage {

    render() {

        return <ion-content>
            <div>
                Test 1 - custom content component
                <ionx-dialog component="ionx-test-dialog-content"/>
            </div>

            <div>
                Test 23 - header+message
                <ionx-dialog header="Hello boys!" subheader="This is sooo special..." message="Are you really want to delete?"/>
            </div>
        </ion-content>
    }
}
