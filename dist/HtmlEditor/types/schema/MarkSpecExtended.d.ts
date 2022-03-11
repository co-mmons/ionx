import { Keymap } from "prosemirror-commands";
import { MarkSpec, Schema } from "prosemirror-model";
import { OrderedSchemaSpec } from "./OrderedSchemaSpec";
export declare abstract class MarkSpecExtended implements MarkSpec {
  readonly abstract name: string;
  keymap?(schema: Schema): Keymap;
  configure?(schema: OrderedSchemaSpec): void;
}
