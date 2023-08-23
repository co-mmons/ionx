import {redo, undo} from "prosemirror-history";
import {undoInputRule} from "prosemirror-inputrules";
import {isApple} from "../isApple";
import {Keymap} from "../Keymap";

export const undoRedoKeymap: Keymap = {
    "Mod-z": undo,
    "Shift-Mod-z": redo,
    "Backspace": undoInputRule,
    ...(isApple ? {"Mod-y": redo} : {})
}
