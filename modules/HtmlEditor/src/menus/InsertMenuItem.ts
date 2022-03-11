import {MessageRef} from "@co.mmons/js-intl";
import {Schema} from "prosemirror-model";
import {EditorView} from "prosemirror-view";

export interface InsertMenuItem {
    iconName?: string;
    iconSrc?: string;
    label: string | MessageRef;
    sublabel: string | MessageRef,
    disabled?: boolean;
    handler: (view?: EditorView<Schema>) => any | Promise<any>;
}
