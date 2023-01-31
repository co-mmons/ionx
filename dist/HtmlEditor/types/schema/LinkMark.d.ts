import { LinkScheme } from "ionx/LinkEditor";
import { DOMOutputSpecArray } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class LinkMark extends MarkSpecExtended {
  constructor(options?: {
    schemes: LinkScheme[];
  });
  readonly name: string;
  schemes?: LinkScheme[];
  attrs: {
    href: {};
    target: {
      default: any;
    };
    title: {
      default: any;
    };
    value: {
      default: any;
    };
  };
  inclusive: boolean;
  parseDOM: {
    tag: string;
    getAttrs(dom: HTMLElement | string): {
      href: string;
      target: string;
      title: string;
      value: any;
    };
  }[];
  toDOM(node: any): DOMOutputSpecArray;
}
