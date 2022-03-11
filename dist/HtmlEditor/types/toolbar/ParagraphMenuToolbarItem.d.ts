import { MessageRef } from "@co.mmons/js-intl";
import { Schema } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
import { ToolbarItem } from "./ToolbarItem";
export declare class ParagraphMenuToolbarItem extends ToolbarItem {
  label: MessageRef;
  menuComponent: string;
  isVisible(view: EditorView<Schema>): boolean;
  isActive(view: EditorView): boolean;
}
