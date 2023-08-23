import {
    chainCommands,
    createParagraphNear, exitCode,
    liftEmptyBlock,
    newlineInCode,
    splitBlock
} from "prosemirror-commands";
import {Keymap} from "../Keymap";

export const enterKeymap: Keymap = {
    "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
    "Mod-Enter": exitCode
}
