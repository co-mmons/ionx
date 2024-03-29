import {Node as ProsemirrorNode, NodeSpec, Schema} from "prosemirror-model";
import {Decoration, EditorView, NodeView} from "prosemirror-view";
import {Keymap} from "../Keymap";
import {MarkSpecExtended} from "./MarkSpecExtended";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

export abstract class NodeSpecExtended implements NodeSpec {

    readonly abstract name: string;

    marks?: string;

    content?: string;

    keymap?(schema: Schema): Keymap;

    allowMark(mark: string | MarkSpecExtended) {

        const marks = new Set(this.marks ? this.marks.split(" ") : []);

        if (mark instanceof MarkSpecExtended) {
            mark = mark.name;
        }

        marks.add(mark);

        this.marks = [...marks.values()].join(" ");
    }

    allowContent(node: string | NodeSpecExtended) {

        const content = new Set(this.content ? this.content.split(" ") : []);

        if (node instanceof NodeSpecExtended) {
            node = node.name;
        }

        content.add(node);

        this.content = [...content.values()].join(" ");
    }

    configure?(schema: OrderedSchemaSpec): void;

    render?(node: ProsemirrorNode, view?: EditorView, getPos?: () => number, decorations?: Decoration[]): NodeView;
}
