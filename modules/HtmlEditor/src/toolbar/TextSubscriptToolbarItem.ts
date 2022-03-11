import {MessageRef} from "@co.mmons/js-intl";
import {iconsPath} from "../iconsPath";
import {TextToolbarItem} from "./TextToolbarItem";

export class TextSubscriptToolbarItem extends TextToolbarItem {

    constructor() {
        super("subscript");
    }

    label = new MessageRef("ionx/HtmlEditor", "Subscript|text");
    iconSrc = `${iconsPath}/subscript.svg`;
}
