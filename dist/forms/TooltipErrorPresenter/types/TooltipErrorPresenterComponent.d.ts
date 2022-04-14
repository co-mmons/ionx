import { ComponentInterface } from "@stencil/core";
import { TooltipErrorPresenterImpl } from "./TooltipErrorPresenterImpl";
import { TooltipErrorPresenterOptions } from "./TooltipErrorPresenterOptions";
export declare class TooltipErrorPresenterComponent implements ComponentInterface {
  element: HTMLElement;
  instance?: TooltipErrorPresenterImpl | false;
  private instance$;
  options?: TooltipErrorPresenterOptions;
  connectedCallback(): void;
  disconnectedCallback(): void;
}
