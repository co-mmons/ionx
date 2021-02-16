import {MessageRef} from "@co.mmons/js-intl";
import {FunctionalComponent} from "@stencil/core";
import {FormValidator} from "../forms";
import {LinkTarget} from "./LinkTarget";

export interface LinkScheme {

    readonly label: MessageRef;

    readonly valueComponent: string | FunctionalComponent;

    readonly valueComponentProps?: {[key: string]: any};

    readonly valueValidators?: FormValidator[];

    readonly valueHint?: MessageRef;

    readonly valueLabel?: MessageRef;

    readonly targets?: LinkTarget[];

    buildHref(value: any, params?: any): string;
}

