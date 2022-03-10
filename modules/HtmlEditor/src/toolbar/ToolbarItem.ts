import {MessageRef} from "@co.mmons/js-intl";
import {EditorView} from "prosemirror-view";

export abstract class ToolbarItem {
    label: string | MessageRef;
    iconName?: string;
    iconSrc?: string;
    activeIconName?: string;
    activeIconSrc?: string;

    handler

    isActive?(view: EditorView): boolean;
    isVisible?(view: EditorView): boolean;

}
