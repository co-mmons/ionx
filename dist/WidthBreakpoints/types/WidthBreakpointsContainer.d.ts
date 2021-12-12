export declare class WidthBreakpointsContainer {
  private readonly element;
  private accessorName?;
  constructor(element: HTMLElement, accessorName?: string);
  private observer;
  private resized;
  private connect;
  disconnect(): void;
}
export declare namespace WidthBreakpointsContainer {
  const defaultAccessorName = "ionx-width-breakpoints";
}
