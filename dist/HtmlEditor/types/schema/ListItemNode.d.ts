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
    Enter: (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
  };
  configure(schema: OrderedSchemaSpec): void;
}
