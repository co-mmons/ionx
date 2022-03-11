import { MessageRef } from "@co.mmons/js-intl";
import { Schema } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
export declare type ToolbarItemLayout = "icon" | "label";
export declare abstract class ToolbarItem {
  iconVisible?: boolean;
  labelVisible?: boolean;
  label: string | MessageRef;
  menuComponent?: string;
  menuComponentProps?(view?: EditorView<Schema>): {
    [key: string]: any;
  } | Promise<{
    [key: string]: any;
  }>;
  iconName?: string;
  iconSrc?: string;
  isActive?(view: EditorView<Schema>): boolean;
  isVisible?(view: EditorView<Schema>): boolean;
  handler?(view: EditorView<Schema>): any;
}
