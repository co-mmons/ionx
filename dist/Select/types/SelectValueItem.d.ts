import { MessageRef } from "@co.mmons/js-intl";
export interface SelectValueItem<T = any> {
  icon?: string;
  label?: string | MessageRef;
  value: T;
}
