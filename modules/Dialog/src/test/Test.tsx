import {Component, h, Host} from "@stencil/core";
import {FormField} from "ionx/forms";
import {Grid, GridCol, GridRow} from "ionx/Grid";
import {showDialog} from "../index";

@Component({
    tag: "ionx-test"
})
export class Test {

    render() {

        return <Host>

            <Grid>

                <h1>Date time</h1>

                <GridRow>
                    <GridCol>
                        <FormField label="simple dialog">
                            <ion-button onClick={() => showDialog({header: "ososo", buttons: [{label: "oaoao", role: "cancel"}]})}>simple</ion-button>
                        </FormField>
                    </GridCol>
                </GridRow>

            </Grid>

        </Host>
    }
}
