import { Keymap } from "prosemirror-commands";
import { DOMOutputSpecArray, Schema } from "prosemirror-model";
import { NodeSpecExtended } from "./NodeSpecExtended";
export declare class HardBreakNode extends NodeSpecExtended {
  readonly name: string;
  inline: boolean;
  group: string;
  selectable: boolean;
  parseDOM: {
    tag: string;
  }[];
  toDOM(): DOMOutputSpecArray;
  keymap(schema: Schema): Keymap;
}
