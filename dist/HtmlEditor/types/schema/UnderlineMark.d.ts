import { DOMOutputSpec, ParseRule, Schema } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class UnderlineMark extends MarkSpecExtended {
  readonly name = "underline";
  group: string;
  parseDOM: ParseRule[];
  toDOM(): DOMOutputSpec;
  keymap(schema: Schema): {
    "Mod-u": import("prosemirror-state").Command;
    "Mod-U": import("prosemirror-state").Command;
  };
}
