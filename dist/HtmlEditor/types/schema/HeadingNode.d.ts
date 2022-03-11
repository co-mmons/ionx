import { DOMOutputSpecArray, Node, ParseRule } from "prosemirror-model";
import { NodeSpecExtended } from "./NodeSpecExtended";
export declare class HeadingNode extends NodeSpecExtended {
  readonly name: string;
  attrs: {
    level: {
      default: number;
    };
    indent: {
      default: any;
    };
  };
  content: string;
  group: string;
  defining: boolean;
  private getAttrs;
  parseDOM: ParseRule[];
  toDOM(node: Node): DOMOutputSpecArray;
}
