import {MessageRef} from "@co.mmons/js-intl";
import {Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue} from "@co.mmons/js-utils/core";

export class Alignment extends Enum {

    static values() {
        return super.values() as Alignment[];
    }

    static valueOf(value: EnumValueOfValue) {
        return super.valueOf(value) as Alignment;
    }

    static fromJSON(value: EnumFromJSONValue) {
        return super.fromJSON(value) as Alignment;
    }

    static readonly left = new Alignment("left");
    static readonly right = new Alignment("right");
    static readonly center = new Alignment("center");
    static readonly justify = new Alignment("justify");

    private constructor(public readonly name: EnumValueName<typeof Alignment>) {
        super(name);
        this.label = new MessageRef("ionx/HtmlEditor", "alignmentMenu/" + name);
    }

    readonly label: MessageRef;
}
