import {NodeSpecExtended} from "./NodeSpecExtended";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

export class ParagraphNode extends NodeSpecExtended {

    readonly name: string = "paragraph";

    attrs = {
        indent: {default: null}
    }

    content = "inline*";

    // marks: "AlignmentMark StrongMark UnderlineMark EmphasisMark FontSizeMark LinkMark TextColorMark",

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

        for (const mark of ["alignment", "emphasis", "strong", "underline", "fontSize", "link", "textColor"]) {
            if (schema.marks.get(mark)) {
                this.allowMark(mark);
            }
        }

    }
}
