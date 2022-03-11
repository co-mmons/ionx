import { Keymap } from "prosemirror-commands";
import { NodeSpec, Schema } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
import { OrderedSchemaSpec } from "./OrderedSchemaSpec";
export declare abstract class NodeSpecExtended implements NodeSpec {
  readonly abstract name: string;
  marks?: string;
  content?: string;
  keymap?(schema: Schema): Keymap;
  allowMark(mark: string | MarkSpecExtended): void;
  allowContent(node: string | NodeSpecExtended): void;
  configure?(schema: OrderedSchemaSpec): void;
}
