import {MarkSpec} from "prosemirror-model";

export const textColor: MarkSpec = {
    attrs: {
        color: {},
    },
    parseDOM: [
        {
            style: "color",
            getAttrs: color => {
                return {color};
            },
        },
    ],
    toDOM(mark) {
        return [
            "span",
            {style: `color: ${mark.attrs.color}`},
            0
        ];
    },
};
