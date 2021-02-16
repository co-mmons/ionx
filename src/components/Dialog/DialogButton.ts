export interface DialogButton {
    label?: string;
    role?: string;
    color?: string;
    cssClass?: string | string[];
    size?: "default" | "small" | "large";
    icon?: string;
    flex?: string | number;
    handler?: (value: any) => boolean | void | Promise<boolean | void>;
    valueHandler?: () => any | Promise<any>;
}
