import { DOMOutputSpecArray, ParseRule, Schema } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class UnderlineMark extends MarkSpecExtended {
  readonly name = "underline";
  group: string;
  parseDOM: ParseRule[];
  toDOM(): DOMOutputSpecArray;
  keymap(schema: Schema): {
    "Mod-u": (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
    "Mod-U": (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
  };
}
