import { DOMOutputSpec, Schema } from "prosemirror-model";
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
  toDOM(): DOMOutputSpec;
  keymap(schema: Schema): {
    "Mod-i": import("prosemirror-state").Command;
    "Mod-I": import("prosemirror-state").Command;
  };
}
