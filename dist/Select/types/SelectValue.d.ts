import { MessageRef } from "@co.mmons/js-intl";
export interface SelectValue<T = any> {
  icon?: string;
  label?: string | MessageRef;
  value: T;
}
