import { StyleEventDetail } from "@ionic/core/components";
import { EventEmitter } from "@stencil/core";
import { EventUnlisten } from "ionx/utils";
import { DateTimeInputProps } from "./DateTimeInputProps";
import { DateTimeInputType } from "./DateTimeInputType";
import { DateTimeInputValue } from "./DateTimeInputValue";
export declare class Input implements DateTimeInputProps {
  element: HTMLElement;
  /**
   * @inheritDoc
   */
  type: DateTimeInputType;
  /**
   * @inheritDoc
   */
  placeholder: string;
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
  value: DateTimeInputValue;
  /**
   * @inheritDoc
   */
  initialValue?: DateTimeInputValue;
  /**
   * @inheritDoc
   */
  timeZoneDisabled: boolean;
  /**
   * @inheritDoc
   */
  timeZoneRequired: boolean;
  /**
   * @inheritDoc
   */
  defaultTimeZone: string;
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
  formatOptions: Intl.DateTimeFormatOptions;
  ionChange: EventEmitter<{
    value: DateTimeInputValue;
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
  valueChanged(value: DateTimeInputValue, old: DateTimeInputValue): void;
  get isDateOnly(): boolean;
  get isDateTime(): boolean;
  get isLocalDateTime(): boolean;
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
