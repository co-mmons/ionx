import { SelectDividerItem } from "./SelectDividerItem";
import { SelectItem } from "./SelectItem";
import { SelectValueItem } from "./SelectValueItem";
import { ValueComparator } from "./ValueComparator";
export interface SelectOverlayProps {
  overlay: "modal" | "popover";
  overlayTitle?: string;
  sortable?: boolean;
  searchTest?: (query: string, value: any, label: string) => boolean;
  /**
   * Copy of {@link Select.items}.
   */
  items: SelectItem[];
  lazyItems?: () => Promise<Array<SelectValueItem | SelectDividerItem>>;
  multiple?: boolean;
  values?: any[];
  empty?: boolean;
  comparator?: ValueComparator;
  checkValidator?: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];
  labelFormatter?: (value: any) => string;
}
