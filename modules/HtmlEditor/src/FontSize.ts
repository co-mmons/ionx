import {MessageRef} from "@co.mmons/js-intl";
import {Enum} from "@co.mmons/js-utils/core";

export class FontSize extends Enum {
    static readonly small = new FontSize("small");
    static readonly large = new FontSize("large");

    private constructor(name: string) {
        super(name);
        this.label = new MessageRef("ionx/HtmlEditor", "textMenu/fontSize/" + name.toUpperCase()[0] + name.substring(1));
    }

    readonly label: MessageRef;
}
