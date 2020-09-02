import {Component, ComponentInterface, h} from "@stencil/core";
import {showDialog} from "../../../components/Dialog";

@Component({
    tag: "ionx-test-dialog"
})
export class DialogTestPage implements ComponentInterface {

    componentDidLoad() {
        // this.showDialog();
    }

    showDialog() {
        showDialog({header: "test", buttons: [{label: "Anuluj", color: "primary"}, {label: "Ok", color: "danger"}], message: `

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
        `});
    }

    showDialogWithCustomContentComponent() {
        showDialog({component: "ionx-test-dialog-content"});
    }

    showDialogWithCustomMessageComponent() {
        showDialog({header: "Yuhuhuh", buttons: [{label: "Ok", role: "cancel"}], messageComponent: "ionx-test-dialog-message"});
    }

    render() {

        return <ion-content>
            <div>
                <h1>Test 1 - custom content component</h1>
                <ionx-dialog component="ionx-test-dialog-content"/>
            </div>

            <div>
                <h1>Test 2 - header+message</h1>
                <ionx-dialog
                    header="Hello boys!"
                    subheader="This is sooo special..."
                    message="Are you really want to delete?"
                    buttons={[
                        {label: "Anuluj"},
                        {label: "Ok", color: "danger", icon: "trash"}
                        ]}/>
            </div>

            <div>
                <h1>Test 3 - overlay</h1>
                <ion-button onClick={() => this.showDialog()}>open overlay</ion-button>
            </div>

            <div>
                <h1>Test 4 - overlay with custom content component</h1>
                <ion-button onClick={() => this.showDialogWithCustomContentComponent()}>open overlay</ion-button>
            </div>

            <div>
                <h1>Test 5 - overlay with custom message component</h1>
                <ion-button onClick={() => this.showDialogWithCustomMessageComponent()}>open overlay</ion-button>
            </div>

        </ion-content>
    }
}
