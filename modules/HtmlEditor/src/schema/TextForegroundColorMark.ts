import {DOMOutputSpec, ParseRule} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class TextForegroundColorMark extends MarkSpecExtended {

    readonly name: string = "textForegroundColor";

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

    toDOM(mark): DOMOutputSpec {
        return [
            "span",
            {style: `color: ${mark.attrs.color}`},
            0
        ]
    }
}
