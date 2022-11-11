import { MediaBreakpoint } from "ionx/utils";
import { Observable } from "rxjs";
export interface WidthBreakpointChange {
  breakpoint: MediaBreakpoint;
  queries: string[];
}
export declare class WidthBreakpointsContainer {
  private readonly element;
  private accessorName?;
  constructor(element: HTMLElement, accessorName?: string);
  private changeObservable;
  get breakpointChange(): Observable<WidthBreakpointChange>;
  private observer;
  private resized;
  private connect;
  disconnect(): void;
}
export declare namespace WidthBreakpointsContainer {
  const defaultAccessorName = "ionx-width-breakpoints";
}
