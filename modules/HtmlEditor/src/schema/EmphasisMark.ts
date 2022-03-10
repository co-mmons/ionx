import {toggleMark} from "prosemirror-commands";
import {DOMOutputSpecArray, Schema} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

const em = "em";
const emDOM = [em, 0] as DOMOutputSpecArray;

export class EmphasisMark extends MarkSpecExtended {

    readonly name = "emphasis";

    parseDOM = [
        {tag: "i"},
        {tag: em},
        {style: "font-style=italic"}
    ]

    toDOM() {
        return emDOM
    }

    keymap(schema: Schema) {
        const cmd = toggleMark(schema.marks[this.name]);
        return {
            "Mod-i": cmd,
            "Mod-I": cmd
        }
    }
}
