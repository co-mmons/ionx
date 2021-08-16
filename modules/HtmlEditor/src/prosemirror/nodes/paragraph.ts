import {NodeSpec} from "prosemirror-model";

export const paragraph: NodeSpec = {
    attrs: {
        indent: {default: null}
    },
    content: "inline*",
    marks: "alignment strong underline em fontSize link textColor",
    group: "block",

    parseDOM: [{
        tag: "p",
        getAttrs(node: HTMLElement) {
            const indent = node.style.textIndent || null;
            return {indent};
        }
    }],

    toDOM(node) {

        const {indent} = node.attrs;
        const attrs = {};

        const style: string[] = [];

        if (indent) {
            style.push(`text-indent: ${indent}`);
        }

        if (style.length) {
            attrs["style"] = style.join(";");
        }

        return ["p", attrs, 0];
    }
}
