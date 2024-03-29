import {sleep} from "@co.mmons/js-utils/core";
import {Component, h, Host} from "@stencil/core";
import {defineIonxForms, FormController, FormField} from "ionx/forms";
import {SelectLazyGroupItem} from "ionx/Select";
import {Select} from "../index";
import {SelectItem} from "../SelectItem";

defineIonxForms()


@Component({
    tag: "ionx-test"
})
export class Test {

    data = new FormController({
        select1: {value: undefined as number},
        select2: {value: [2, 1] as number[]},
        select3: {value: undefined as string[]},
        select4: {value: ["a:1", "a:2"] as string[]},
    }).bindRenderer(this)

    basicItems: SelectItem[] = [
        {label: "test", value: 1},
        {label: "aloha", divider: true},
        {label: "city", value: 2},
        {label: "b", value: 3},
        {label: "c", value: 4},
        {label: "d", value: 5}
    ];

    async lazyItems(_values?: any[]) {

        await sleep(1000);

        return [
            {label: "lazy something, lorem ipsum lorem ipsum, lorem lorem 1", value: 1},
            {label: "lazy 2", value: 2}
        ];

    }

    groupItems: SelectItem[] = [
        {
            group: true,
            label: "Group A",
            id: "a",
            items: [
                {value: "a:1", label: "Ohohoo A"}
            ]},
        {
            group: true,
            label: "Group B",
            id: "b",
            values(values: any[]) {
                return values.filter(value => typeof value === "string" && value.startsWith("b:"));
            },
            items: async () => {
                await sleep(500);
                const items = [];
                for (let i = 0; i <= 60; i++) {
                    items.push({value: "b:" + i, label: "Ahahaha B" + i});
                }
                return items;
            }
        },
    ]

    lazyGroup: SelectLazyGroupItem = {
        group: true,
        label: "Group B",
        id: "b",
        values(values: any[]) {
            return values.filter(value => typeof value === "string" && value.startsWith("a:"));
        },
        items: async () => {
            await sleep(500);
            const items = [];
            for (let i = 0; i <= 60; i++) {
                items.push({value: "a:" + i, label: "Ahahaha A" + i});
            }
            return items;
        }
    }


    render() {

        return <Host>

            <FormField label="Simple">
                <ionx-select placeholder="Olahahas" items={this.basicItems} ref={this.data.controls.select1.attach()}>
                    <ion-icon name="language-outline" slot="icon"/>
                </ionx-select>
            </FormField>

            <fieldset>
                <legend>Simple multiple</legend>
                <ionx-select items={this.basicItems} multiple={true}/>
            </fieldset>

            <ionx-form-field label="multiple + sortable" style={{"--form-field-container-overflow": "hidden"}}>
                <ionx-select
                    placeholder="Choose..."
                    overlayTitle="Title here"
                    overlay="modal"
                    sortable={true}
                    multiple={true}
                    lazyItems={this.lazyItems.bind(this)}
                    ref={this.data.controls.select2.attach()}/>

                <div>Selected: {this.data.controls.select2.value?.join(", ") ?? "empty"}</div>

            </ionx-form-field>

            <fieldset>
                <legend>groups</legend>
                <Select
                    placeholder="Choose..."
                    overlayTitle="Title here"
                    overlay="modal"
                    sortable={true}
                    multiple={true}
                    items={this.groupItems}
                    ref={this.data.controls.select3.attach()}/>

            </fieldset>

            <fieldset>
                <legend>lazy group</legend>
                <Select
                    placeholder="Choose..."
                    overlayTitle="Title here"
                    overlay="modal"
                    multiple={true}
                    lazyItems={this.lazyGroup}
                    ref={this.data.controls.select4.attach()}/>

            </fieldset>

        </Host>
    }
}
