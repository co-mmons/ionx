import {MessageRef} from "@co.mmons/js-intl";
import {findParentNode} from "prosemirror-utils";
import {EditorView} from "prosemirror-view";
import {ToolbarItem} from "./ToolbarItem";

export class ListMenuToolbarItem extends ToolbarItem {
    label = new MessageRef("ionx/HtmlEditor", "listMenu/List");
    menuComponent = "ionx-html-editor-list-menu";

    isVisible(view: EditorView): boolean {
        const {schema, selection} = view.state;
        const {nodes} = schema;
        return (nodes.orderedList || nodes.bulletList) && !!findParentNode(predicate => predicate.hasMarkup(nodes.orderedList) || predicate.hasMarkup(nodes.bulletList))(selection);
    }

    isActive(): boolean {
        return true;
    }
}
