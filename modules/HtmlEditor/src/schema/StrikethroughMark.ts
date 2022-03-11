import {DOMOutputSpecArray, ParseRule} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class StrikethroughMark extends MarkSpecExtended {

    readonly name: string = "strikethrough";
    group = "textFormat";

    parseDOM: ParseRule[] = [
        {tag: "s"},
        {style: "text-decoration=line-through"},
        {style: "text-decoration-line=line-through"}
    ]

    toDOM(): DOMOutputSpecArray {
        return ["s", 0]
    }
}
