import { ComponentInterface } from "@stencil/core";
import { SelectDivider } from "./SelectDivider";
import { SelectGroup } from "./SelectGroup";
import { SelectItem } from "./SelectItem";
import { SelectValue } from "./SelectValue";
import { ValueComparator } from "./ValueComparator";
export declare class SelectOverlay implements ComponentInterface {
  element: HTMLElement;
  overlay: "modal" | "popover";
  overlayTitle: string;
  sortable: boolean;
  searchTest: (query: string, value: any, label: string) => boolean;
  items: SelectItem[];
  lazyItems: (values?: any[]) => Promise<Array<SelectValue | SelectDivider>>;
  visibleItems: SelectItem[];
  multiple: boolean;
  values: any[];
  empty: boolean;
  comparator: ValueComparator;
  checkValidator: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];
  labelFormatter?: (value: any) => string;
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
  toggleGroup(group: SelectGroup): Promise<void>;
  cancel(): void;
  ok(): void;
  connectedCallback(): void;
  renderItem(item: SelectItem, index: number): any;
  render(): any;
}
