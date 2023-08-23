import {toggleMark} from "prosemirror-commands";
import {DOMOutputSpec, Schema} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

const strong = "strong";
const domSpec = [strong, 0] as DOMOutputSpec;

export class StrongMark extends MarkSpecExtended {

    readonly name: string = strong;
    group = "textFormat";

    readonly parseDOM = [
        {tag: strong},
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null},
        {style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}
    ]

    toDOM() {
        return domSpec
    }

    keymap(schema: Schema) {
        const cmd = toggleMark(schema.marks[this.name]);
        return {
            "Mod-b": cmd,
            "Mod-B": cmd
        }
    }
}
