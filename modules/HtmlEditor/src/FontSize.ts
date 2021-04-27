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

    static readonly xxSmall = new FontSize("xxSmall", "xx-small");
    static readonly xSmall = new FontSize("xSmall", "x-small");
    static readonly small = new FontSize("small", "small");
    static readonly large = new FontSize("large", "large");
    static readonly xLarge = new FontSize("xLarge", "x-large");
    static readonly xxLarge = new FontSize("xxLarge", "xx-large");

    private constructor(public readonly name: EnumValueName<typeof FontSize>, public readonly css: string) {
        super(name);
        this.label = new MessageRef("ionx/HtmlEditor", `textMenu/fontSize/${name}`);
    }

    readonly label: MessageRef;
}
