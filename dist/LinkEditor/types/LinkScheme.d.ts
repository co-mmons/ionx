import { MessageRef } from "@co.mmons/js-intl";
import { HtmlString } from "@co.mmons/js-utils/core";
import { FunctionalComponent } from "@stencil/core";
import { FormValidator } from "ionx/forms";
import { Link } from "./Link";
import { LinkTarget } from "./LinkTarget";
export interface LinkScheme {
  readonly label: MessageRef | string;
  readonly valueComponent: string | FunctionalComponent;
  readonly valueComponentProps?: {
    [key: string]: any;
  };
  readonly valueValidators?: FormValidator[];
  readonly valueHint?: MessageRef | string | HtmlString;
  readonly valueLabel?: MessageRef | string;
  valueTargets?(value?: any): LinkTarget[];
  buildHref(value: any, params?: any): string;
  parseLink(link: string | Link): LinkScheme.ParsedLink;
}
export declare namespace LinkScheme {
  interface ParsedLink {
    scheme: LinkScheme;
    value: any;
    target?: LinkTarget;
  }
}
