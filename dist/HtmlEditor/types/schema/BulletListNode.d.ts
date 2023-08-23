import { DOMOutputSpec } from "prosemirror-model";
import { NodeSpecExtended } from "./NodeSpecExtended";
export declare class BulletListNode extends NodeSpecExtended {
  readonly name: string;
  content: string;
  group: string;
  parseDOM: {
    tag: string;
  }[];
  toDOM(): DOMOutputSpec;
}
