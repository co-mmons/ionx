import {MessageRef} from "@co.mmons/js-intl";
import {iconsPath} from "../iconsPath";
import {TextToolbarItem} from "./TextToolbarItem";

export class TextStrikethroughToolbarItem extends TextToolbarItem {

    constructor() {
        super("strikethrough");
    }

    label = new MessageRef("ionx/HtmlEditor", "Strikethrough|text");
    iconSrc = `${iconsPath}/strikethrough.svg`;
}
