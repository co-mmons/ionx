import {TimeZoneDate} from "@co.mmons/js-utils/core";
import {Component, h, Host} from "@stencil/core";
import {defineIonxForms, FormController} from "ionx/forms";

import {$DateTimeInput} from "../index";

defineIonxForms()

@Component({
    tag: "ionx-test"
})
export class Test {

    data = new FormController({
        date1: {value: new TimeZoneDate()}
    }).bindRenderer(this)

    render() {

        return <Host>

            <ionx-form-field label="simple with time zone required">
                <$DateTimeInput ref={this.data.controls.date1.attach()}/>
                <div>value: {JSON.stringify(this.data.controls.date1.value.toJSON())}</div>
            </ionx-form-field>

            <ionx-form-field label="time zone not required">
                <$DateTimeInput placeholder="Shalalala" timeZoneRequired={false}/>
            </ionx-form-field>

            <ionx-form-field label="only date">
                <$DateTimeInput dateOnly={true} placeholder="Choose..."/>
            </ionx-form-field>

        </Host>
    }
}
