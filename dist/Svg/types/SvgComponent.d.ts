import { ComponentInterface } from "@stencil/core";
export declare class SvgComponent implements ComponentInterface {
  element: HTMLElement;
  src: string;
  source: string | ArrayBuffer;
  srcSource: string | ArrayBuffer;
  sourceChanged(source: string | ArrayBuffer): void;
  loadSrc(src: string): Promise<void>;
  componentWillLoad(): Promise<void>;
  render(): any;
}
