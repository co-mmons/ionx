import { TimeZoneDate } from "@co.mmons/js-utils/core";
export declare class DateTimeOverlay {
  element: HTMLElement;
  dateOnly: boolean;
  date: Date;
  timeZoneDisabled: boolean;
  value: TimeZoneDate;
  values: {
    [key: string]: string | number;
  };
  ranges(): {
    Year: number[];
    Month: number[];
    Day: number[];
    Hour: number[];
    Minute: number[];
  };
  ok(): void;
  cancel(): void;
  onKeyDown(event: KeyboardEvent): Promise<void>;
  onChange(event: CustomEvent): void;
  connectedCallback(): void;
  renderPart(part: "Hour" | "Minute" | "Year" | "Month" | "Day" | "Time zone", range?: number[]): any;
  render(): any;
}
