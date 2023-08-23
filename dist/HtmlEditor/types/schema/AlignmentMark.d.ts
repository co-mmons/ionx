import { DOMOutputSpec } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class AlignmentMark extends MarkSpecExtended {
  readonly name: string;
  excludes: string;
  group: string;
  attrs: {
    align: {};
  };
  parseDOM: {
    tag: string;
    getAttrs: (dom: any) => false | {
      align: string;
    };
  }[];
  toDOM(mark: any): DOMOutputSpec[];
}
