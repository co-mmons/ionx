import {MarkSpecExtended} from "./MarkSpecExtended";

export class FontSizeMark extends MarkSpecExtended {

    readonly name = "fontSize";
    group = "textFormat"

    attrs = {fontSize: {}};

    parseDOM = [
        {
            style: "font-size",
            getAttrs: fontSize => {
                return {fontSize};
            }
        }
    ]

    toDOM(mark) {
        return ["span", {style: `font-size: ${mark.attrs.fontSize}`}, 0];
    }

}
