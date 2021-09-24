import {MarkSpec} from "prosemirror-model";

export const fontSize: MarkSpec = {
    attrs: {
        fontSize: {},
    },
    parseDOM: [
        {
            style: "font-size",
            getAttrs: fontSize => {
                return {fontSize};
            },
        },
    ],
    toDOM(mark) {
        return [
            "span",
            {style: `font-size: ${mark.attrs.fontSize}`},
            0
        ];
    },
};
