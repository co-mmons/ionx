import { DOMOutputSpec, ParseRule } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class SuperscriptMark extends MarkSpecExtended {
  readonly name: string;
  group: string;
  excludes: string;
  parseDOM: ParseRule[];
  toDOM(): DOMOutputSpec;
}
