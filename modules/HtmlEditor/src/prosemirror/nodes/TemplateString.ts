import {unserialize} from "@co.mmons/js-utils/json";
import {NodeSpec} from "prosemirror-model";

export const TemplateString: NodeSpec = {
    attrs: {},
    group: "inline",
    inline: true,
    draggable: true,

    toDOM: (node) => {

        return [
            "app-template-string",
            {"props": JSON.stringify(node.attrs.props)}
        ];
    },

    parseDOM: [
        {
            tag: "app-template-string",
            getAttrs: (dom) => {

                // @ts-ignore
                const info = unserialize(JSON.parse(dom.getAttribute("props")));

                return {
                    "props": info
                };
            },
        }
    ]
};
