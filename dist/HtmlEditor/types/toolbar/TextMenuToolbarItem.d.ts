import { MessageRef } from "@co.mmons/js-intl";
import { EditorView } from "prosemirror-view";
import { ToolbarItem } from "./ToolbarItem";
export declare class TextMenuToolbarItem extends ToolbarItem {
  label: MessageRef;
  menuComponent: string;
  isActive(view: EditorView): boolean;
}
