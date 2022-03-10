import {MessageRef} from "@co.mmons/js-intl";
import {InsertMenuItem} from "../menus/InsertMenuItem";
import {InsertMenuItemFactory} from "../menus/InsertMenuItemFactory";
import {ToolbarItem} from "./ToolbarItem";

export class InsertToolbarItem extends ToolbarItem {

    constructor(...items: Array<InsertMenuItem | InsertMenuItemFactory>) {
        super();
        this.items = items;
    }

    protected readonly items: Array<InsertMenuItem | InsertMenuItemFactory>;

    label = new MessageRef("ionx/HtmlEditor", "Insert")
}
