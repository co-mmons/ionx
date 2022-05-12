import { DateTimeInputType } from "./DateTimeInputType";
import { DateTimeInputValue } from "./DateTimeInputValue";
declare type NumericDateTimePart = "Hour" | "Minute" | "Year" | "Month" | "Day";
export declare class Overlay {
  element: HTMLElement;
  type: DateTimeInputType;
  timeZoneDisabled: boolean;
  timeZoneRequired: boolean;
  value: DateTimeInputValue;
  date: Date;
  monthFormatter: Intl.DateTimeFormat;
  dayOfWeekFormatter: Intl.DateTimeFormat;
  numericValues: {
    [key: string]: number;
  };
  timeZoneValue: string;
  get isDateOnly(): boolean;
  get isDateTime(): boolean;
  get isLocalDateTime(): boolean;
  ranges(): {
    Year: number[];
    Month: number[];
    Day: number[];
    Hour: number[];
    Minute: number[];
  };
  move(part: NumericDateTimePart, step: -1 | 1): void;
  now(): void;
  ok(): void;
  cancel(): void;
  onFocus(event: CustomEvent): Promise<void>;
  onKeyDown(event: KeyboardEvent): Promise<void>;
  onChange(event: CustomEvent): void;
  didEnter(): Promise<void>;
  componentWillLoad(): Promise<void>;
  connectedCallback(): void;
  renderPart(part: NumericDateTimePart | "Time zone", range?: number[]): any;
  render(): any;
}
export {};
