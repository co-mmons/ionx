import {MessageRef} from "@co.mmons/js-intl";
import {EditorView} from "prosemirror-view";
import {isMarkActive} from "../prosemirror/active";
import {ToolbarItem} from "./ToolbarItem";

export class LinkToolbarItem extends ToolbarItem {
    label = new MessageRef("ionx/LinkEditor", "Link");
    menuComponent = "ionx-html-editor-link-menu";

    isVisible(view: EditorView): boolean {
        const {marks} = view.state.schema;
        return marks.link && isMarkActive(view.state, marks.link);
    }
}
