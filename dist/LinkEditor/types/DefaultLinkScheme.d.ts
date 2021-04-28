import { MessageRef } from "@co.mmons/js-intl";
import { Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue } from "@co.mmons/js-utils/core";
import { FormValidator } from "ionx/forms";
import { DefaultLinkTarget } from "./DefaultLinkTarget";
import { Link } from "./Link";
import { LinkScheme } from "./LinkScheme";
export declare class DefaultLinkScheme extends Enum implements LinkScheme {
  readonly name: EnumValueName<typeof DefaultLinkScheme>;
  static readonly www: DefaultLinkScheme;
  static readonly email: DefaultLinkScheme;
  static readonly tel: DefaultLinkScheme;
  static readonly sms: DefaultLinkScheme;
  static values(): DefaultLinkScheme[];
  static valueOf(value: EnumValueOfValue): DefaultLinkScheme;
  static fromJSON(value: EnumFromJSONValue): DefaultLinkScheme;
  private constructor();
  readonly label: MessageRef;
  readonly valueComponent: string;
  readonly valueComponentProps: {
    [key: string]: any;
  };
  readonly valueValidators: FormValidator[];
  readonly valueLabel: MessageRef;
  readonly valueHint: MessageRef;
  valueTargets(): DefaultLinkTarget[];
  buildHref(value: string): string;
  parseLink(link: string | Link): LinkScheme.ParsedLink;
}
