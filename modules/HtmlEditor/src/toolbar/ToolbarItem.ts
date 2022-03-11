import {MessageRef} from "@co.mmons/js-intl";
import {Schema} from "prosemirror-model";
import {EditorView} from "prosemirror-view";

export abstract class ToolbarItem {
    label: string | MessageRef;
    menuComponent?: string;
    menuComponentProps?(view?: EditorView<Schema>): {[key: string]: any} | Promise<{[key: string]: any}>;
    iconName?: string;
    iconSrc?: string;
    activeIconName?: string;
    activeIconSrc?: string;
    isActive?(view: EditorView<Schema>): boolean;
    isVisible?(view: EditorView<Schema>): boolean;
}
