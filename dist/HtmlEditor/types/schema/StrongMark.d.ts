import { DOMOutputSpecArray, Schema } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class StrongMark extends MarkSpecExtended {
  readonly name: string;
  group: string;
  readonly parseDOM: ({
    tag: string;
    getAttrs?: undefined;
    style?: undefined;
  } | {
    tag: string;
    getAttrs: (node: any) => any;
    style?: undefined;
  } | {
    style: string;
    getAttrs: (value: any) => any;
    tag?: undefined;
  })[];
  toDOM(): DOMOutputSpecArray;
  keymap(schema: Schema): {
    "Mod-b": (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
    "Mod-B": (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
  };
}
