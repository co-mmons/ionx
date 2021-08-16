import { MarkSpec, NodeSpec, Schema } from "prosemirror-model";
export declare const nodes: {
  doc: {
    content: string;
    marks: string;
  };
  paragraph: NodeSpec;
  blockquote: NodeSpec;
  horizontalRule: NodeSpec;
  heading: NodeSpec;
  text: NodeSpec;
  hardBreak: NodeSpec;
  bulletList: NodeSpec;
  orderedList: NodeSpec;
  listItem: NodeSpec;
  youtube: NodeSpec;
};
export declare const marks: {
  link: MarkSpec;
  em: MarkSpec;
  strong: MarkSpec;
  alignment: MarkSpec;
  fontSize: MarkSpec;
  textColor: MarkSpec;
  underline: MarkSpec;
};
export declare const schema: Schema<"text" | "paragraph" | "heading" | "doc" | "blockquote" | "horizontalRule" | "hardBreak" | "bulletList" | "orderedList" | "listItem" | "youtube", "alignment" | "link" | "em" | "strong" | "fontSize" | "textColor" | "underline">;
