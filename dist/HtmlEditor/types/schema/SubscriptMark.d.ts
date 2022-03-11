import { DOMOutputSpecArray, ParseRule } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class SubscriptMark extends MarkSpecExtended {
  readonly name: string;
  group: string;
  excludes: string;
  parseDOM: ParseRule[];
  toDOM(): DOMOutputSpecArray;
}
