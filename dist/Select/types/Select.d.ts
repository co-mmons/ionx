import { StyleEventDetail } from "@ionic/core";
import { EventEmitter, FunctionalComponent } from "@stencil/core";
import { SelectOption } from "./SelectOption";
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
   * If multiple values selection can be ordered after selection.
   */
  orderable: boolean;
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
  options: SelectOption[];
  lazyOptions: () => Promise<SelectOption[]>;
  labelComponent?: string | FunctionalComponent<{
    value: any;
    option?: SelectOption;
    label: string;
    index: number;
    readonly?: boolean;
  }>;
  labelFormatter?: (value: any) => string;
  separator?: string;
  values: any[];
  value: any;
  valueChangeSilent: boolean;
  valueChanged(niu: any): void;
  private changeValues;
  ionChange: EventEmitter<{
    value: any;
  }>;
  ionFocus: EventEmitter<any>;
  setFocus(options?: FocusOptions): Promise<void>;
  setBlur(): Promise<void>;
  focused: boolean;
  onFocus(): void;
  onBlur(): void;
  /**
   * Emitted when the styles change.
   * @internal
   */
  ionStyle: EventEmitter<StyleEventDetail>;
  private emitStyle;
  open(): Promise<void>;
  connectedCallback(): void;
  render(): any;
}
