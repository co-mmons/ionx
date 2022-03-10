import {DOMOutputSpecArray, ParseRule} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class TextColorMark extends MarkSpecExtended {

    readonly name: string = "textColor";

    group = "textFormat";

    attrs = {
        color: {},
    }

    parseDOM: ParseRule[] = [
        {
            style: "color",
            getAttrs: color => {
                return {color};
            }
        }
    ]

    toDOM(mark): DOMOutputSpecArray {
        return [
            "span",
            {style: `color: ${mark.attrs.color}`},
            0
        ]
    }
}
