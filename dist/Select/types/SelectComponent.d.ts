import { ItemReorderEventDetail, StyleEventDetail } from "@ionic/core";
import { EventEmitter, FunctionalComponent } from "@stencil/core";
import { SelectLazyGroupItem } from "./SelectGroupItem";
import { SelectItem } from "./SelectItem";
import { SelectProps } from "./SelectProps";
import { SelectValueItem } from "./SelectValueItem";
import { ValueComparator } from "./ValueComparator";
export declare class SelectComponent implements SelectProps {
  element: HTMLElement;
  /**
   * @inheritDoc
   */
  placeholder: string;
  /**
   * @inheritDoc
   */
  overlay: SelectProps.Overlay;
  /**
   * @inheritDoc
   */
  overlayTitle: string;
  /**
   * @inheritDoc
   */
  overlayOptions: SelectProps.OverlayOptions;
  /**
   * @inheritDoc
   */
  alwaysArray: boolean;
  /**
   * @inheritDoc
   */
  comparator: ValueComparator;
  /**
   * @inheritDoc
   */
  multiple: boolean;
  /**
   * @inheritDoc
   */
  sortable: boolean;
  /**
   * @inheritDoc
   */
  empty: boolean;
  /**
   * @inheritDoc
   */
  readonly: boolean;
  /**
   * @inheritDoc
   */
  disabled: boolean;
  /**
   * @inheritDoc
   */
  searchTest: SelectProps.SearchTestFn;
  /**
   * @inheritDoc
   */
  checkValidator: SelectProps.CheckValidatorFn;
  /**
   * @deprecated
   */
  options: SelectItem[];
  /**
   * @inheritDoc
   */
  items: SelectItem[];
  /**
   * @inheritDoc
   */
  lazyItems: SelectProps.LazyItemsFn | SelectLazyGroupItem;
  /**
   * @inheritDoc
   */
  labelComponent?: string | FunctionalComponent<SelectProps.LabelComponentProps>;
  /**
   * @inheritDoc
   */
  labelFormatter?: SelectProps.LabelFormatterFn;
  /**
   * @inheritDoc
   */
  separator?: string;
  /**
   * @inheritDoc
   */
  value: any;
  ionChange: EventEmitter<{
    value: any;
  }>;
  ionFocus: EventEmitter<any>;
  /**
   * @internal
   */
  prefetch: boolean;
  /**
   * Emitted when the styles change.
   * @internal
   */
  ionStyle: EventEmitter<StyleEventDetail>;
  visibleItems: SelectValueItem[];
  valueChanging: boolean;
  focused: boolean;
  loading: boolean;
  readonly internalId: number;
  /**
   * Always returns value as array. If value is undefined, empty array is returned.
   */
  get valueAsArray(): any[];
  protected disabledChanged(): void;
  optionsChanged(niu: SelectItem[]): void;
  itemsChanged(): Promise<void>;
  valueChanged(niu: any, old: any): Promise<void>;
  setFocus(options?: FocusOptions): Promise<void>;
  setBlur(): Promise<void>;
  onFocus(): void;
  onBlur(): void;
  private emitStyle;
  buildVisibleItems(forceRender?: boolean): Promise<void>;
  open(): Promise<void>;
  valuesReorder(ev: CustomEvent<ItemReorderEventDetail>): void;
  componentDidLoad(): void;
  connectedCallback(): void;
  renderValue(values: any[], value: any, index: number): any;
  render(): any;
}
