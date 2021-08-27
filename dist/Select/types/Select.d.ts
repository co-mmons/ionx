import { StyleEventDetail } from "@ionic/core";
import { EventEmitter, FunctionalComponent } from "@stencil/core";
import type Sortable from "sortablejs";
import { LazyItemsFn } from "./LazyItemsFn";
import { SelectLazyGroupItem } from "./SelectGroupItem";
import { SelectItem } from "./SelectItem";
import { SelectValueItem } from "./SelectValueItem";
import { ValueComparator } from "./ValueComparator";
export declare class Select {
  element: HTMLElement;
  placeholder: string;
  overlay: "popover" | "modal";
  overlayTitle: string;
  overlayOptions: {
    whiteSpace?: "nowrap" | "normal";
    title?: string;
  };
  /**
   * Whether value should be always returned as array, no matter if multiple is set to true.
   */
  alwaysArray: boolean;
  comparator: ValueComparator;
  /**
   * If multiple value selection is allowed.
   */
  multiple: boolean;
  /**
   * If multiple values selection can be sorted after selection.
   */
  sortable: boolean;
  empty: boolean;
  readonly: boolean;
  disabled: boolean;
  protected disabledChanged(): void;
  /**
   * A function, that will be used for testing if value passes search critieria.
   * Default implementation checks lowercased label of value against
   * lowercased searched text.
   */
  searchTest: (query: string, value: any, label: string) => boolean;
  checkValidator: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];
  /**
   * @deprecated
   */
  options: SelectItem[];
  items: SelectItem[];
  lazyItems: LazyItemsFn | SelectLazyGroupItem;
  labelComponent?: string | FunctionalComponent<{
    value: any;
    item?: SelectItem;
    label: string;
    index: number;
    readonly?: boolean;
  }>;
  labelFormatter?: (value: any) => string;
  separator?: string;
  value: any;
  ionChange: EventEmitter<{
    value: any;
  }>;
  ionFocus: EventEmitter<any>;
  /**
   * Emitted when the styles change.
   * @internal
   */
  ionStyle: EventEmitter<StyleEventDetail>;
  visibleItems: SelectValueItem[];
  valueChanging: boolean;
  focused: boolean;
  loading: boolean;
  sortableInstance: Sortable;
  readonly internalId: number;
  /**
   * Always returns value as array. If value is undefined, empty array is returned.
   */
  get valueAsArray(): any[];
  optionsChanged(niu: SelectItem[]): void;
  valueChanged(niu: any, old: any): Promise<void>;
  setFocus(options?: FocusOptions): Promise<void>;
  setBlur(): Promise<void>;
  onFocus(): void;
  onBlur(): void;
  private emitStyle;
  buildVisibleItems(): Promise<void>;
  open(): Promise<void>;
  configureSortable(): Promise<void>;
  connectedCallback(): void;
  renderValue(values: any[], value: any, index: number): any;
  render(): any;
}
