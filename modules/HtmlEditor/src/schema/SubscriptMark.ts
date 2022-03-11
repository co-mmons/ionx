import {DOMOutputSpecArray, ParseRule} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class SubscriptMark extends MarkSpecExtended {

    readonly name: string = "subscript";
    group = "textFormat";
    excludes = "superscript";

    parseDOM: ParseRule[] = [
        {tag: "sub"}
    ]

    toDOM(): DOMOutputSpecArray {
        return ["sub", 0]
    }
}
