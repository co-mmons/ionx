import { MessageRef } from "@co.mmons/js-intl";
import { Link } from "./Link";
import { LinkScheme } from "./LinkScheme";
export declare const unknownScheme: {
  readonly label: MessageRef;
  readonly valueComponent: "ion-input";
  readonly valueLabel: MessageRef;
  buildHref(value: any): string;
  parseLink(_link: string | Link): LinkScheme.ParsedLink;
};
