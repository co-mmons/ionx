import {MessageRef} from "@co.mmons/js-intl";
import {EditorView} from "prosemirror-view";
import {isMarkActive} from "../prosemirror/active";
import {ToolbarItem} from "./ToolbarItem";

export class LinkToolbarItem extends ToolbarItem {
    label = new MessageRef("ionx/LinkEditor", "Link");

    isVisible(view: EditorView): boolean {
        return isMarkActive(view.state, view.state.schema.marks.link)
    }
}
