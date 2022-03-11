import {MessageRef} from "@co.mmons/js-intl";
import {InsertMenuItem, InsertMenuItemFactory} from "../menus";
import {ToolbarItem} from "./ToolbarItem";

export class InsertToolbarItem extends ToolbarItem {

    constructor(...items: Array<InsertMenuItem | InsertMenuItemFactory>) {
        super();
        this.items = items;
    }

    protected readonly items: Array<InsertMenuItem | InsertMenuItemFactory>;

    label = new MessageRef("ionx/HtmlEditor", "Insert")
    menuComponent = "ionx-html-editor-insert-menu"

    menuComponentProps(view) {

        const items: InsertMenuItem[] = [];
        for (let item of this.items) {

            if (typeof item === "function") {
                item = item(view);
            }

            // can be nullish, e.g. if a factory checks for a mark in schema
            if (item) {
                items.push(item);
            }
        }

        return {items}
    }
}
