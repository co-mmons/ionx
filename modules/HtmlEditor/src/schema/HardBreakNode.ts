import {DOMOutputSpec, Schema} from "prosemirror-model";
import {isApple} from "../isApple";
import {Keymap} from "../Keymap";
import {NodeSpecExtended} from "./NodeSpecExtended";

const br = "br"
const brDOM: DOMOutputSpec[] = [br];

export class HardBreakNode extends NodeSpecExtended {

    readonly name: string = "hardBreak";

    inline = true;
    group = "inline";
    selectable = false;

    parseDOM = [{tag: br}];

    toDOM() {
        return brDOM
    }

    keymap(schema: Schema): Keymap {

        const node = schema.nodes[this.name];

        const cmd = (state, dispatch) => {
            dispatch(state.tr.replaceSelectionWith(node.create()).scrollIntoView());
            return true;
        }

        return {
            "Mod-Enter": cmd,
            "Shift-Enter": cmd,
            ...(isApple ? {"Ctrl-Enter": cmd} : {})
        }
    }
}
