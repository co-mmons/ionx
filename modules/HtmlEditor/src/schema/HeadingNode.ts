import {DOMOutputSpecArray, Node, ParseRule} from "prosemirror-model";
import {NodeSpecExtended} from "./NodeSpecExtended";

export class HeadingNode extends NodeSpecExtended {

    readonly name: string = "heading";

    attrs = {
        level: {default: 1},
        indent: {default: null}
    }

    content = "inline*";
    group = "block";
    defining = true;

    private getAttrs(node: HTMLElement) {
        const level = parseInt(node.tagName.substring(1));
        const indent = node.style.textIndent || null;
        return {level, indent: indent && !indent.startsWith("0") ? indent : null};
    }

    parseDOM: ParseRule[] = [
        {tag: "h1", getAttrs: this.getAttrs},
        {tag: "h2", getAttrs: this.getAttrs},
        {tag: "h3", getAttrs: this.getAttrs},
        {tag: "h4", getAttrs: this.getAttrs},
        {tag: "h5", getAttrs: this.getAttrs},
        {tag: "h6", getAttrs: this.getAttrs}
    ]

    toDOM(node: Node) {

        const {indent} = node.attrs;
        const attrs = {};

        const style: string[] = [];

        if (indent) {
            style.push(`text-indent: ${indent}`);
        }

        if (style.length) {
            attrs["style"] = style.join(";");
        }

        return [`h${node.attrs.level}`, attrs, 0] as DOMOutputSpecArray;
    }
}
