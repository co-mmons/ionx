import {Component, h} from "@stencil/core";
import {FormController} from "ionx/forms";
import {SelectOption} from "../SelectOption";

@Component({
    tag: "ionx-select-test"
})
export class SelectTest {

    data = new FormController({
        select: {value: null as number}
    }).bindRenderer(this)

    render() {
        const options: SelectOption[] = [{label: "test", value: 1}];
        return <ionx-select options={options} ref={this.data.controls.select.attach()}/>
    }
}
