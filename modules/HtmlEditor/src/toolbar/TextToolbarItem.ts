import {MessageRef} from "@co.mmons/js-intl";
import {Schema} from "prosemirror-model";
import {EditorView} from "prosemirror-view";
import {anyMarkActive} from "../prosemirror/active";
import {isMarkFromGroup} from "../prosemirror/utils/isMarkFromGroup";
import {ToolbarItem} from "./ToolbarItem";

export class TextToolbarItem extends ToolbarItem {
    label = new MessageRef("ionx/HtmlEditor", "Text");
    menuComponent = "ionx-html-editor-text-menu";

    isActive(view: EditorView): boolean {
        return anyMarkActive(view.state, Object.values((view.state.schema as Schema).marks).filter(mark => isMarkFromGroup(mark, "textFormat")));
    }
}
