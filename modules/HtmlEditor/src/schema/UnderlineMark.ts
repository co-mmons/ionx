import {toggleMark} from "prosemirror-commands";
import {DOMOutputSpecArray, ParseRule, Schema} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class UnderlineMark extends MarkSpecExtended {

    readonly name = "underline";
    group = "textFormat";

    parseDOM: ParseRule[] = [
        {tag: "u"},
        {style: "text-decoration=underline"}
    ]

    toDOM() {
        return ["u", 0] as DOMOutputSpecArray;
    }

    keymap(schema: Schema) {
        const cmd = toggleMark(schema.marks[this.name]);
        return {
            "Mod-u": cmd,
            "Mod-U": cmd
        }
    }

}
