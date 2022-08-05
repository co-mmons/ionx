import {PredefinedColors} from "@ionic/core";

export interface ContextMenuItem {
    label: string;
    iconName?: string;
    iconSrc?: string;
    handler: () => void;
    disabled?: boolean;
    color?: PredefinedColors;
}
