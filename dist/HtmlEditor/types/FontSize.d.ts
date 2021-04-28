import { MessageRef } from "@co.mmons/js-intl";
import { Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue } from "@co.mmons/js-utils/core";
export declare class FontSize extends Enum {
  readonly name: EnumValueName<typeof FontSize>;
  readonly css: string;
  static values(): FontSize[];
  static valueOf(value: EnumValueOfValue): FontSize;
  static fromJSON(value: EnumFromJSONValue): FontSize;
  static readonly xxSmall: FontSize;
  static readonly xSmall: FontSize;
  static readonly small: FontSize;
  static readonly large: FontSize;
  static readonly xLarge: FontSize;
  static readonly xxLarge: FontSize;
  private constructor();
  readonly label: MessageRef;
}
