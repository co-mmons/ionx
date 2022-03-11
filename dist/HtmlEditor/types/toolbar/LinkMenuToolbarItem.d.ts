import { MessageRef } from "@co.mmons/js-intl";
import { EditorView } from "prosemirror-view";
import { ToolbarItem } from "./ToolbarItem";
export declare class LinkMenuToolbarItem extends ToolbarItem {
  label: MessageRef;
  menuComponent: string;
  isActive(): boolean;
  isVisible(view: EditorView): boolean;
}
