import { MessageRef } from "@co.mmons/js-intl";
import { EditorView } from "prosemirror-view";
import { ToolbarItem } from "./ToolbarItem";
export declare class ListMenuToolbarItem extends ToolbarItem {
  label: MessageRef;
  menuComponent: string;
  isVisible(view: EditorView): boolean;
  isActive(): boolean;
}
