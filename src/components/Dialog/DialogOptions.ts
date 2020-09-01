import {DialogButton} from "./DialogButton";

export interface DialogOptions {

    header?: string;
    subheader?: string;

    /**
     * Name of the tag, that should be displayed inside....
     */
    component?: string;

    componentProps?: {[prop: string]: any};

    message?: string;

    messageComponent?: string;

    messageComponentProps?: {[prop: string]: any};

    buttons?: DialogButton[];

    width?: string;
}
