import { MessageRef } from "@co.mmons/js-intl";
import { SelectDividerItem } from "./SelectDividerItem";
import { SelectValueItem } from "./SelectValueItem";
interface ItemsFn {
  (): Promise<Array<SelectValueItem | SelectDividerItem>>;
  (values: any[]): Promise<SelectValueItem[]>;
}
interface ValuesFn {
  (values: any[]): any[];
}
export interface SelectGroupItem {
  label: string | MessageRef;
  group: true;
  id: string;
  /**
   * Returns values (from given values), that are covered by this group.
   */
  values?: ValuesFn;
  /**
   * Items of this group.
   */
  items: Array<SelectValueItem | SelectDividerItem> | ItemsFn;
}
export interface SelectLazyGroupItem extends SelectGroupItem {
  /**
   * @inheritDoc
   */
  values: ValuesFn;
  /**
   * @inheritDoc
   */
  items: ItemsFn;
}
export {};
