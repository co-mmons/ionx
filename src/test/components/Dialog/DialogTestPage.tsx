import {Component, ComponentInterface, h} from "@stencil/core";
import {showDialog} from "../../../components/Dialog";

@Component({
    tag: "ionx-test-dialog"
})
export class DialogTestPage implements ComponentInterface {

    componentDidLoad() {
        this.showDialog();
    }

    showDialog() {
        showDialog({header: "test", buttons: [{label: "Ok"}], message: `

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
        `});
    }

    render() {

        return <ion-content>
            <div>
                Test 1 - custom content component
                <ionx-dialog component="ionx-test-dialog-content"/>
            </div>

            <div>
                Test 23 - header+message
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
                <ion-button onClick={() => this.showDialog()}>open overlay</ion-button>
            </div>
        </ion-content>
    }
}
