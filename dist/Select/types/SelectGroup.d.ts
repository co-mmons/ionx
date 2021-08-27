import { MessageRef } from "@co.mmons/js-intl";
import { SelectDivider } from "./SelectDivider";
import { SelectValue } from "./SelectValue";
interface ItemsFunction {
  (): Promise<Array<SelectValue | SelectDivider>>;
  (values: any[]): Promise<SelectValue[]>;
}
export interface SelectGroup {
  label: string | MessageRef;
  group: true;
  id: string;
  /**
   * Returns values (from given values), that are covered by this group.
   */
  values?: <T = any>(values: T[]) => T[];
  /**
   * Items of this group.
   */
  items?: Array<SelectValue | SelectDivider> | ItemsFunction;
}
export {};
