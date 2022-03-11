import {MessageRef} from "@co.mmons/js-intl";
import {Schema} from "prosemirror-model";
import {findParentNodeOfType} from "prosemirror-utils";
import {EditorView} from "prosemirror-view";
import {ToolbarItem} from "./ToolbarItem";

export class ParagraphToolbarItem extends ToolbarItem {
    label = new MessageRef("ionx/HtmlEditor", "Paragraph");
    menuComponent = "ionx-html-editor-paragraph-menu";

    isVisible(view: EditorView<Schema>) {
        const {nodes} = view.state.schema;
        return !!nodes.heading || !!nodes.paragraph;
    }

    isActive(view: EditorView): boolean {
        const {selection, schema} = view.state;
        return !!findParentNodeOfType(schema.nodes.heading)(selection);
    }
}
