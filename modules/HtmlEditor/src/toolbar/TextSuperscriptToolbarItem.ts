import {MessageRef} from "@co.mmons/js-intl";
import {iconsPath} from "../iconsPath";
import {TextToolbarItem} from "./TextToolbarItem";

export class TextSuperscriptToolbarItem extends TextToolbarItem {

    constructor() {
        super("superscript");
    }

    label = new MessageRef("ionx/HtmlEditor", "Superscript|text");
    iconSrc = `${iconsPath}/superscript.svg`;
}
