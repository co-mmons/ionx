import { TimeZoneDate } from "@co.mmons/js-utils/core";
declare type NumericDateTimePart = "Hour" | "Minute" | "Year" | "Month" | "Day";
export declare class DateTimeOverlay {
  element: HTMLElement;
  dateOnly: boolean;
  timeZoneDisabled: boolean;
  timeZoneRequired: boolean;
  value: TimeZoneDate;
  date: Date;
  numericValues: {
    [key: string]: number;
  };
  timeZoneValue: string;
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
  componentWillLoad(): Promise<void>;
  connectedCallback(): void;
  renderPart(part: NumericDateTimePart | "Time zone", range?: number[]): any;
  render(): any;
}
export {};
