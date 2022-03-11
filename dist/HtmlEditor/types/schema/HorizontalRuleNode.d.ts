import { DOMOutputSpecArray } from "prosemirror-model";
import { NodeSpecExtended } from "./NodeSpecExtended";
export declare class HorizontalRuleNode extends NodeSpecExtended {
  readonly name = "horizontalRule";
  group: string;
  parseDOM: {
    tag: string;
  }[];
  toDOM(): DOMOutputSpecArray;
}
