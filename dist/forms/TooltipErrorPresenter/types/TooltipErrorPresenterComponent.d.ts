import { ComponentInterface } from "@stencil/core";
import { TooltipErrorPresenter } from "./TooltipErrorPresenter";
import { TooltipErrorPresenterOptions } from "./TooltipErrorPresenterOptions";
export declare class TooltipErrorPresenterComponent implements ComponentInterface {
  element: HTMLElement;
  instance?: TooltipErrorPresenter | false;
  private instance$;
  options?: TooltipErrorPresenterOptions;
  connectedCallback(): void;
  disconnectedCallback(): void;
}
