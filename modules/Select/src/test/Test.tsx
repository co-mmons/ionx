import {Component, h} from "@stencil/core";
import {FormController} from "ionx/forms";
import {SelectOption} from "../SelectOption";

@Component({
    tag: "ionx-test"
})
export class Test {

    data = new FormController({
        select: {value: null as number}
    }).bindRenderer(this)

    render() {
        const options: SelectOption[] = [
            {label: "test", value: 1},
            {label: "aloha", value: "ksdksd", divider: true},
            {label: "city", value: 2}
        ];
        return <ionx-select options={options} ref={this.data.controls.select.attach()}/>
    }
}
