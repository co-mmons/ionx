import {MessageRef} from "@co.mmons/js-intl";
import {iconsPath} from "../iconsPath";
import {TextToolbarItem} from "./TextToolbarItem";

export class TextUnderlineToolbarItem extends TextToolbarItem {

    constructor() {
        super("underline");
    }

    label = new MessageRef("ionx/HtmlEditor", "Underline|text");
    iconSrc = `${iconsPath}/underline.svg`;
}
