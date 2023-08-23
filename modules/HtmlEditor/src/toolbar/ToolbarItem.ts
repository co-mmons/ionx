import {MessageRef} from "@co.mmons/js-intl";
import {EditorView} from "prosemirror-view";

export type ToolbarItemLayout = "icon" | "label";

export abstract class ToolbarItem {
    iconVisible?: boolean;
    labelVisible?: boolean;
    label: string | MessageRef;
    menuComponent?: string;
    menuComponentProps?(view?: EditorView): {[key: string]: any} | Promise<{[key: string]: any}>;
    iconName?: string;
    iconSrc?: string;
    isActive?(view: EditorView): boolean;
    isVisible?(view: EditorView): boolean;

    handler?(view: EditorView): any;
}
