import {TimeZoneDate} from "@co.mmons/js-utils/core";
import {Component, h, Host} from "@stencil/core";
import {defineIonxForms, FormController} from "ionx/forms";

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
                <ionx-date-time ref={this.data.controls.date1.attach()}/>
            </ionx-form-field>

            <ionx-form-field label="time zone not required">
                <ionx-date-time placeholder="Choose..." timeZoneRequired={false}/>
            </ionx-form-field>

            <ionx-form-field label="only date">
                <ionx-date-time dateOnly={true} placeholder="Choose..."/>
            </ionx-form-field>

        </Host>
    }
}
