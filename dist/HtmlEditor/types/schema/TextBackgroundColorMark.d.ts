import { DOMOutputSpecArray, ParseRule } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class TextBackgroundColorMark extends MarkSpecExtended {
  readonly name: string;
  group: string;
  attrs: {
    color: {};
  };
  parseDOM: ParseRule[];
  toDOM(mark: any): DOMOutputSpecArray;
}
