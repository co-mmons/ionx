import {Keymap} from "prosemirror-commands";
import {Mark, MarkSpec, Schema} from "prosemirror-model";
import {EditorView, NodeView} from "prosemirror-view";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

export abstract class MarkSpecExtended implements MarkSpec {
    readonly abstract name: string;
    keymap?(schema: Schema): Keymap;
    configure?(schema: OrderedSchemaSpec): void;
    render?(mark: Mark<Schema>, view?: EditorView<Schema>, inline?: boolean): Pick<NodeView<Schema>, "dom" | "contentDOM">
}
