import { DOMOutputSpec, ParseRule } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class StrikethroughMark extends MarkSpecExtended {
  readonly name: string;
  group: string;
  parseDOM: ParseRule[];
  toDOM(): DOMOutputSpec;
}
