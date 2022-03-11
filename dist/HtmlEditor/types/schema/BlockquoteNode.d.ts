import { DOMOutputSpecArray, ParseRule } from "prosemirror-model";
import { NodeSpecExtended } from "./NodeSpecExtended";
export declare class BlockquoteNode extends NodeSpecExtended {
  readonly name: string;
  content: string;
  group: string;
  defining: boolean;
  parseDOM: ParseRule[];
  toDOM(): DOMOutputSpecArray;
}
