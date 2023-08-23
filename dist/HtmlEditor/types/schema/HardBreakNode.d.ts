import { DOMOutputSpec, Schema } from "prosemirror-model";
import { Keymap } from "../Keymap";
import { NodeSpecExtended } from "./NodeSpecExtended";
export declare class HardBreakNode extends NodeSpecExtended {
  readonly name: string;
  inline: boolean;
  group: string;
  selectable: boolean;
  parseDOM: {
    tag: string;
  }[];
  toDOM(): DOMOutputSpec[];
  keymap(schema: Schema): Keymap;
}
