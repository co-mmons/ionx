import {MessageRef} from "@co.mmons/js-intl";
import {iconsPath} from "../iconsPath";
import {TextToolbarItem} from "./TextToolbarItem";

export class TextStrongToolbarItem extends TextToolbarItem {

    constructor() {
        super("strong");
    }

    label = new MessageRef("ionx/HtmlEditor", "Bold|text");
    iconSrc = `${iconsPath}/bold.svg`;
}
