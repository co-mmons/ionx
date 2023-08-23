import {MessageRef} from "@co.mmons/js-intl";
import {EditorView} from "prosemirror-view";
import {isBlockMarkActive} from "../prosemirror/utils/selection/isBlockMarkActive";
import {ToolbarItem} from "./ToolbarItem";

export class AlignmentToolbarItem extends ToolbarItem {
    label = new MessageRef("ionx/HtmlEditor", "Alignment");
    menuComponent = "ionx-html-editor-alignment-menu";

    isVisible(view: EditorView) {
        return !!view.state.schema.marks.alignment;
    }

    isActive(view: EditorView): boolean {
        return isBlockMarkActive(view.state, view.state.schema.marks.alignment);
    }
}
