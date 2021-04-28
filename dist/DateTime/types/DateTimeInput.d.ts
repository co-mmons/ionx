import { TimeZoneDate } from "@co.mmons/js-utils/core";
import { StyleEventDetail } from "@ionic/core";
import { EventEmitter } from "@stencil/core";
import { EventUnlisten } from "ionx/utils";
export declare class DateTimeInput {
  element: HTMLElement;
  placeholder: string;
  dateOnly: boolean;
  /**
   * Whether timezone cannot be changed.
   */
  timeZoneDisabled: boolean;
  /**
   * Timezone, that will be set, when new value is picked from picker.
   */
  defaultTimeZone: string;
  clearButtonVisible: boolean;
  clearButtonIcon: string;
  clearButtonText: string;
  readonly: boolean;
  readonlyChanged(): void;
  disabled: boolean;
  disabledChanged(): void;
  formatOptions: Intl.DateTimeFormatOptions;
  value: TimeZoneDate;
  valueChanged(niu: TimeZoneDate, old: TimeZoneDate, fireEvent?: boolean): void;
  formattedValue: string;
  formatValue(): string;
  ionChange: EventEmitter<any>;
  ionFocus: EventEmitter<any>;
  setFocus(options?: FocusOptions): Promise<void>;
  setBlur(): Promise<void>;
  onKeyDown(ev: KeyboardEvent): void;
  focused: boolean;
  onFocus(): void;
  onBlur(): void;
  onClick(ev: MouseEvent): void;
  /**
   * Emitted when the styles change.
   * @internal
   */
  ionStyle: EventEmitter<StyleEventDetail>;
  emitStyle(): void;
  clearButtonClicked(ev: Event): void;
  clearValue(): void;
  nativePicker: HTMLInputElement;
  overlayVisible: boolean;
  open(event?: any): Promise<void>;
  itemClickUnlisten: EventUnlisten;
  connectedCallback(): void;
  disconnectedCallback(): void;
  initItemListener(): Promise<void>;
  render(): any;
}
