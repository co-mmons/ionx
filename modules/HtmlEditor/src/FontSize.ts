import {MessageRef} from "@co.mmons/js-intl";
import {Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue} from "@co.mmons/js-utils/core";

export class FontSize extends Enum {

    static values() {
        return super.values() as FontSize[];
    }

    static valueOf(value: EnumValueOfValue) {
        return super.valueOf(value) as FontSize;
    }

    static fromJSON(value: EnumFromJSONValue) {
        return super.fromJSON(value) as FontSize;
    }

    static readonly small = new FontSize("small");
    static readonly large = new FontSize("large");

    private constructor(public readonly name: EnumValueName<typeof FontSize>) {
        super(name);
        this.label = new MessageRef("ionx/HtmlEditor", "textMenu/fontSize/" + name.toUpperCase()[0] + name.substring(1));
    }

    readonly label: MessageRef;
}
