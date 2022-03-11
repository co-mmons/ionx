import { NodeSpecExtended } from "./NodeSpecExtended";
export declare class OrderedListNode extends NodeSpecExtended {
  readonly name: string;
  content: string;
  group: string;
  attrs: {
    order: {
      default: number;
    };
  };
  parseDOM: {
    tag: string;
    getAttrs(dom: any): {
      order: number;
    };
  }[];
  toDOM(node: any): (string | number | {
    start: any;
  })[];
}
