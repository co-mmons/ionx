import { EditorView } from "prosemirror-view";
export interface ToolbarItem {
  label: string;
  isActive: (view: EditorView) => boolean;
}
