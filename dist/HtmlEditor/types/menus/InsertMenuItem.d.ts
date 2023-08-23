import { MessageRef } from "@co.mmons/js-intl";
import { EditorView } from "prosemirror-view";
export interface InsertMenuItem {
  iconName?: string;
  iconSrc?: string;
  label: string | MessageRef;
  sublabel?: string | MessageRef;
  disabled?: boolean;
  handler: (view?: EditorView) => any | Promise<any>;
}
