import {DOMOutputSpecArray, ParseRule} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class TextBackgroundColorMark extends MarkSpecExtended {

    readonly name: string = "textBackgroundColor";

    group = "textFormat";

    attrs = {
        color: {},
    }

    parseDOM: ParseRule[] = [
        {
            style: "background-color",
            getAttrs: color => {
                return {color};
            }
        }
    ]

    toDOM(mark): DOMOutputSpecArray {
        return [
            "span",
            {style: `background-color: ${mark.attrs.color}`},
            0
        ]
    }
}
