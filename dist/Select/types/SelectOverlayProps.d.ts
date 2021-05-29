import { SelectOption } from "./SelectOption";
import { ValueComparator } from "./ValueComparator";
export interface SelectOverlayProps {
  overlay: "modal" | "popover";
  overlayTitle?: string;
  orderable?: boolean;
  searchTest?: (query: string, value: any, label: string) => boolean;
  options: SelectOption[];
  multiple?: boolean;
  values?: any[];
  empty?: boolean;
  comparator?: ValueComparator;
  checkValidator?: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];
  labelFormatter?: (value: any) => string;
}
