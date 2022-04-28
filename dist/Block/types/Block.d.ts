import { WidthBreakpointsContainer } from "ionx/WidthBreakpoints";
import { BlockWidth } from "./BlockWidth";
import { BlockWidthsMap } from "./BlockWidthsMap";
export declare class Block {
  element: HTMLElement;
  innerWidth: BlockWidth | BlockWidthsMap;
  innerAlignment: "start" | "end" | "center";
  innerStyle: {
    [key: string]: string;
  };
  margins: boolean;
  padding: boolean;
  breakpoints: WidthBreakpointsContainer;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
