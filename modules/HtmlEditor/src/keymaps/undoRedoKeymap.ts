import {Keymap} from "prosemirror-commands";
import {redo, undo} from "prosemirror-history";
import {undoInputRule} from "prosemirror-inputrules";
import {isApple} from "../isApple";

export const undoRedoKeymap: Keymap = {
    "Mod-z": undo,
    "Shift-Mod-z": redo,
    "Backspace": undoInputRule,
    ...(isApple ? {"Mod-y": redo} : {})
}
