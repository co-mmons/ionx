import { MessageRef } from "@co.mmons/js-intl";
import { Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue } from "@co.mmons/js-utils/core";
export declare class Alignment extends Enum {
  readonly name: EnumValueName<typeof Alignment>;
  static values(): Alignment[];
  static valueOf(value: EnumValueOfValue): Alignment;
  static fromJSON(value: EnumFromJSONValue): Alignment;
  static readonly left: Alignment;
  static readonly right: Alignment;
  static readonly center: Alignment;
  static readonly justify: Alignment;
  private constructor();
  readonly label: MessageRef;
}
