import { Schema } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { ToolbarItem } from "./ToolbarItem";
export declare abstract class TextToolbarItem extends ToolbarItem {
  readonly markName: string;
  protected constructor(markName: string);
  labelVisible: boolean;
  isVisible(view: EditorView<Schema>): boolean;
  isActive(view: EditorView): boolean;
  handler(view: EditorView<Schema>): void;
}
