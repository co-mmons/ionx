import {DOMOutputSpec, ParseRule} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class SuperscriptMark extends MarkSpecExtended {

    readonly name: string = "superscript";
    group = "textFormat";
    excludes = "subscript";

    parseDOM: ParseRule[] = [
        {tag: "sup"}
    ]

    toDOM(): DOMOutputSpec {
        return ["sup", 0]
    }
}
