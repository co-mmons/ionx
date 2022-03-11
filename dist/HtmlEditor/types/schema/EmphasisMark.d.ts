import { DOMOutputSpecArray, Schema } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class EmphasisMark extends MarkSpecExtended {
  readonly name = "emphasis";
  group: string;
  parseDOM: ({
    tag: string;
    style?: undefined;
  } | {
    style: string;
    tag?: undefined;
  })[];
  toDOM(): DOMOutputSpecArray;
  keymap(schema: Schema): {
    "Mod-i": (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
    "Mod-I": (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
  };
}
