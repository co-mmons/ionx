import { ComponentInterface } from "@stencil/core";
import { WidthBreakpointsContainer } from "./WidthBreakpointsContainer";
export declare class ContainerComponent implements ComponentInterface {
  element: HTMLElement;
  accessorName: string;
  container: WidthBreakpointsContainer;
  /**
   * @internal
   */
  prefetch: boolean;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
