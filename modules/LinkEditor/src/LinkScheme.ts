import {MessageRef} from "@co.mmons/js-intl";
import {FunctionalComponent} from "@stencil/core";
import {FormValidator} from "ionx/forms";
import {Link} from "./Link";
import {LinkTarget} from "./LinkTarget";

export interface LinkScheme {

    readonly label: MessageRef;

    readonly valueComponent: string | FunctionalComponent;

    readonly valueComponentProps?: {[key: string]: any};

    readonly valueValidators?: FormValidator[];

    readonly valueHint?: MessageRef;

    readonly valueLabel?: MessageRef;

    valueTargets?(value?: any): LinkTarget[];

    buildHref(value: any, params?: any): string;

    parseLink(link: string | Link): LinkScheme.ParsedLink;
}

export namespace LinkScheme {

    export interface ParsedLink {
        scheme: LinkScheme;
        value: any;
        target?: LinkTarget;
    }
}
