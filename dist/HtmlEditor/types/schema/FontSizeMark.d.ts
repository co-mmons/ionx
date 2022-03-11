import { MarkSpecExtended } from "./MarkSpecExtended";
export declare class FontSizeMark extends MarkSpecExtended {
  readonly name = "fontSize";
  group: string;
  attrs: {
    fontSize: {};
  };
  parseDOM: {
    style: string;
    getAttrs: (fontSize: any) => {
      fontSize: any;
    };
  }[];
  toDOM(mark: any): (string | number | {
    style: string;
  })[];
}
