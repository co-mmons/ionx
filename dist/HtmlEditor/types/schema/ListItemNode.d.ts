import { Schema } from "prosemirror-model";
import { NodeSpecExtended } from "./NodeSpecExtended";
import { OrderedSchemaSpec } from "./OrderedSchemaSpec";
export declare class ListItemNode extends NodeSpecExtended {
  readonly name = "listItem";
  defining: true;
  content: string;
  parseDOM: {
    tag: string;
  }[];
  toDOM(): (string | number)[];
  keymap(schema: Schema): {
    Enter: import("prosemirror-state").Command;
  };
  configure(schema: OrderedSchemaSpec): void;
}
