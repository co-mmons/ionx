import { DOMOutputSpec, ParseRule } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class TextForegroundColorMark extends MarkSpecExtended {
  readonly name: string;
  group: string;
  attrs: {
    color: {};
  };
  parseDOM: ParseRule[];
  toDOM(mark: any): DOMOutputSpec;
}
