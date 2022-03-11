import {isMarkFromGroup} from "../prosemirror/utils/isMarkFromGroup";
import {NodeSpecExtended} from "./NodeSpecExtended";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

export class ParagraphNode extends NodeSpecExtended {

    readonly name: string = "paragraph";

    attrs = {
        indent: {default: null}
    }

    content = "inline*";

    group = "block";

    parseDOM = [{
        tag: "p",
        getAttrs(node: HTMLElement) {
            const indent = node.style.textIndent || null;
            return {indent: indent && !indent.startsWith("0") ? indent : null};
        }
    }]

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

    configure(schema: OrderedSchemaSpec) {

        schema.marks.forEach((_markName, mark) => {
            if (isMarkFromGroup(mark, "textFormat") || ["link"].includes(mark.name)) {
                this.allowMark(mark);
            }
        })
    }
}
