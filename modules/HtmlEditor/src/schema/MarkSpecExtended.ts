import {Mark, MarkSpec, Schema} from "prosemirror-model";
import {EditorView, NodeView} from "prosemirror-view";
import {Keymap} from "../Keymap";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

export abstract class MarkSpecExtended implements MarkSpec {
    readonly abstract name: string;
    keymap?(schema: Schema): Keymap;
    configure?(schema: OrderedSchemaSpec): void;
    render?(mark: Mark, view?: EditorView, inline?: boolean): Pick<NodeView, "dom" | "contentDOM">
}
