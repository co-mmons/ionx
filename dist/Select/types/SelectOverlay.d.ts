import { ComponentInterface } from "@stencil/core";
import { SelectDividerItem } from "./SelectDividerItem";
import { SelectGroupItem } from "./SelectGroupItem";
import { SelectItem } from "./SelectItem";
import { SelectProps } from "./SelectProps";
import { SelectValueItem } from "./SelectValueItem";
import { ValueComparator } from "./ValueComparator";
export declare class SelectOverlay implements ComponentInterface {
  element: HTMLElement;
  overlay: "modal" | "popover";
  overlayTitle: string;
  sortable: boolean;
  searchTest: (query: string, value: any, label: string) => boolean;
  items: SelectItem[];
  lazyItems: () => Promise<Array<SelectValueItem | SelectDividerItem>>;
  visibleItems: SelectItem[];
  multiple: boolean;
  values: any[];
  empty: boolean;
  comparator: ValueComparator;
  checkValidator: SelectProps.CheckValidatorFn;
  labelFormatter?: SelectProps.LabelFormatterFn;
  didEnter: boolean;
  expandedGroups: {
    [groupId: string]: boolean;
  };
  loadingGroups: {
    [groupId: string]: boolean;
  };
  groupsItems: {
    [groupId: string]: SelectItem[];
  };
  virtualItemHeight: number;
  useVirtualScroll: boolean;
  search(ev: CustomEvent): Promise<void>;
  onDidEnter(): Promise<void>;
  scrollToIndex(index: number): Promise<void>;
  onClick(ev: MouseEvent, item: SelectItem): void;
  onCheck(item: SelectItem, checked: boolean): void;
  toggleGroup(group: SelectGroupItem): Promise<void>;
  cancel(): void;
  ok(): void;
  connectedCallback(): void;
  renderItem(item: SelectItem, index: number): any;
  render(): any;
}
