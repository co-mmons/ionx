import { TimeZoneDate } from "@co.mmons/js-utils/core";
import { StyleEventDetail } from "@ionic/core";
import { EventEmitter } from "@stencil/core";
import { EventUnlisten } from "ionx/utils";
import { DateTimeInputProps } from "./DateTimeInputProps";
export declare class Input implements DateTimeInputProps {
  element: HTMLElement;
  /**
   * @inheritDoc
   */
  placeholder: string;
  /**
   * @inheritDoc
   */
  dateOnly: boolean;
  /**
   * @inheritDoc
   */
  timeZoneDisabled: boolean;
  /**
   * @inheritDoc
   */
  defaultTimeZone: string | "current";
  /**
   * @inheritDoc
   */
  timeZoneRequired: boolean;
  /**
   * @inheritDoc
   */
  clearButtonVisible: boolean;
  /**
   * @inheritDoc
   */
  clearButtonIcon: string;
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
  formatOptions: Intl.DateTimeFormatOptions;
  /**
   * @inheritDoc
   */
  value: TimeZoneDate;
  ionChange: EventEmitter<{
    value: TimeZoneDate;
  }>;
  ionFocus: EventEmitter<any>;
  /**
   * Emitted when the styles change.
   * @internal
   */
  ionStyle: EventEmitter<StyleEventDetail>;
  focused: boolean;
  nativePicker: HTMLInputElement;
  overlayVisible: boolean;
  itemClickUnlisten: EventUnlisten;
  valueChanging: boolean;
  readonlyChanged(): void;
  disabledChanged(): void;
  valueChanged(value: TimeZoneDate, old: TimeZoneDate): void;
  formatValue(): string;
  setFocus(options?: FocusOptions): Promise<void>;
  setBlur(): Promise<void>;
  onKeyDown(ev: KeyboardEvent): void;
  onFocus(): void;
  onBlur(): void;
  onClick(ev: MouseEvent): void;
  emitStyle(): void;
  clearButtonClicked(ev: Event): void;
  clearValue(): Promise<void>;
  open(): Promise<void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  initItemListener(): Promise<void>;
  render(): any;
}
