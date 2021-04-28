import { MessageRef } from "@co.mmons/js-intl";
import { Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue } from "@co.mmons/js-utils/core";
import { LinkTarget } from "./LinkTarget";
export declare class DefaultLinkTarget extends Enum implements LinkTarget {
  readonly name: EnumValueName<typeof DefaultLinkTarget>;
  static readonly self: DefaultLinkTarget;
  static readonly blank: DefaultLinkTarget;
  static values(): DefaultLinkTarget[];
  static valueOf(value: EnumValueOfValue): DefaultLinkTarget;
  static fromJSON(value: EnumFromJSONValue): DefaultLinkTarget;
  constructor(name: EnumValueName<typeof DefaultLinkTarget>);
  readonly label: MessageRef;
  readonly target: string;
}
