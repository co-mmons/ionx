import {MessageRef} from "@co.mmons/js-intl";
import {iconsPath} from "../iconsPath";
import {TextToolbarItem} from "./TextToolbarItem";

export class TextEmphasisToolbarItem extends TextToolbarItem {

    constructor() {
        super("emphasis");
    }

    label = new MessageRef("ionx/HtmlEditor", "Italic|text");
    iconSrc = `${iconsPath}/italic.svg`;
}
