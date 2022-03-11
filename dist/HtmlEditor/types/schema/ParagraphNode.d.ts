import { NodeSpecExtended } from "./NodeSpecExtended";
import { OrderedSchemaSpec } from "./OrderedSchemaSpec";
export declare class ParagraphNode extends NodeSpecExtended {
  readonly name: string;
  attrs: {
    indent: {
      default: any;
    };
  };
  content: string;
  group: string;
  parseDOM: {
    tag: string;
    getAttrs(node: HTMLElement): {
      indent: string;
    };
  }[];
  toDOM(node: any): {}[];
  configure(schema: OrderedSchemaSpec): void;
}
