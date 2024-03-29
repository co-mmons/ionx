import { FunctionalComponent } from "@stencil/core";
import { SelectDividerItem } from "./SelectDividerItem";
import { SelectLazyGroupItem } from "./SelectGroupItem";
import { SelectItem } from "./SelectItem";
import { SelectValueItem } from "./SelectValueItem";
import { ValueComparator } from "./ValueComparator";
export interface SelectProps {
  placeholder?: string;
  overlay?: SelectProps.Overlay;
  overlayTitle?: string;
  overlayOptions?: SelectProps.OverlayOptions;
  /**
   * Whether value should be always returned as array, no matter if multiple is set to true.
   */
  alwaysArray?: boolean;
  comparator?: ValueComparator;
  /**
   * If multiple value selection is allowed.
   */
  multiple?: boolean;
  /**
   * If multiple values selection can be sorted after selection.
   */
  sortable?: boolean;
  empty?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  /**
   * A function, that will be used for testing if value passes search critieria.
   * Default implementation checks lowercased label of value against
   * lowercased searched text.
   */
  searchTest?: SelectProps.SearchTestFn;
  checkValidator?: SelectProps.CheckValidatorFn;
  items?: SelectItem[];
  lazyItems?: SelectProps.LazyItemsFn | SelectLazyGroupItem;
  labelComponent?: string | FunctionalComponent<SelectProps.LabelComponentProps>;
  labelFormatter?: SelectProps.LabelFormatterFn;
  separator?: string;
  value?: any;
}
export declare namespace SelectProps {
  interface SearchTestFn {
    (query: string, value: any, label: string): boolean;
  }
  interface CheckValidatorFn {
    (value: any, checked: boolean, otherCheckedValues: any[], extras?: {
      items: SelectItem[];
    }): any[];
  }
  interface LazyItemsFn {
    (): Promise<Array<SelectValueItem | SelectDividerItem>>;
    (values: any[]): Promise<SelectValueItem[]>;
  }
  interface LabelComponentProps {
    value: any;
    item?: SelectItem;
    label: string;
    index: number;
    readonly?: boolean;
  }
  interface LabelFormatterFn {
    (value: any, overlay?: boolean): string;
  }
  type Overlay = "popover" | "modal";
  interface OverlayOptions {
    whiteSpace?: "nowrap" | "normal";
    title?: string;
  }
}
