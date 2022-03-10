import {
    chainCommands,
    createParagraphNear, exitCode,
    Keymap,
    liftEmptyBlock,
    newlineInCode,
    splitBlock
} from "prosemirror-commands";

export const enterKeymap: Keymap = {
    "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
    "Mod-Enter": exitCode
}
