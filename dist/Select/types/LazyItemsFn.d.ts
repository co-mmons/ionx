import { SelectDividerItem } from "./SelectDividerItem";
import { SelectValueItem } from "./SelectValueItem";
export interface LazyItemsFn {
  (): Promise<Array<SelectValueItem | SelectDividerItem>>;
  (values: any[]): Promise<SelectValueItem[]>;
}
