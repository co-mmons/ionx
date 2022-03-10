import {DOMOutputSpecArray} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class AlignmentMark extends MarkSpecExtended {

    readonly name: string = "alignment";

    excludes = this.name;
    group = "alignment";
    attrs = {align: {}}

    parseDOM = [
        {
            tag: "div[data-align]",
            getAttrs: dom => {
                const align = (dom as Element).getAttribute("data-align");
                return align ? {align} : false;
            }
        }
    ]

    toDOM(mark) {
        return [
            "div",
            {
                style: `text-align: ${mark.attrs.align}`,
                "data-align": mark.attrs.align,
            },
            0
        ] as DOMOutputSpecArray;
    }

}
