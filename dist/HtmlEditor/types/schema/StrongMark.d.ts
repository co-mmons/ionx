import { DOMOutputSpec, Schema } from "prosemirror-model";
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
  toDOM(): DOMOutputSpec;
  keymap(schema: Schema): {
    "Mod-b": import("prosemirror-state").Command;
    "Mod-B": import("prosemirror-state").Command;
  };
}
