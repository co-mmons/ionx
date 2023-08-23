import {toggleMark} from "prosemirror-commands";
import {EditorView} from "prosemirror-view";
import {isMarkActive} from "../prosemirror/active";
import {ToolbarItem} from "./ToolbarItem";

export abstract class TextToolbarItem extends ToolbarItem {

    protected constructor(public readonly markName: string) {
        super();
    }

    labelVisible = false;

    isVisible(view: EditorView): boolean {
        return !!view.state.schema.marks[this.markName];
    }

    isActive(view: EditorView): boolean {
        return isMarkActive(view.state, view.state.schema.marks[this.markName]);
    }

    handler(view: EditorView) {

        const {marks} = view.state.schema;

        const command = toggleMark(marks[this.markName]);

        if (command(view.state)) {
            command(view.state, t => view.dispatch(t));
        }
    }
}
