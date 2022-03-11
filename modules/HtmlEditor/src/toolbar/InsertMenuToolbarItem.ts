import {MessageRef} from "@co.mmons/js-intl";
import {InsertMenuItem, InsertMenuItemFactory} from "../menus";
import {ToolbarItem} from "./ToolbarItem";

export class InsertMenuToolbarItem extends ToolbarItem {

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

                const itms = item(view);

                if (Array.isArray(itms)) {
                    for (const i of itms) {
                        if (i) {
                            items.push(i);
                        }
                    }
                } else if (itms) {
                    items.push(itms);
                }

            } else if (item) {
                items.push(item);
            }
        }

        return {items}
    }
}
