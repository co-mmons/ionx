import { LoadingOptions } from "./LoadingOptions";
export declare class LoadingProxy implements LoadingOptions {
  private element;
  constructor(element: HTMLElement | HTMLIonxLoadingElement);
  private readonly loading;
  dismiss(): Promise<void>;
  get backdropVisible(): boolean;
  set backdropVisible(visible: boolean);
  get header(): string;
  set header(header: string);
  get message(): string;
  set message(message: string);
  get progressBuffer(): number;
  set progressBuffer(buffer: number);
  get progressMessage(): string;
  set progressMessage(message: string);
  get progressPercent(): number;
  set progressPercent(progress: number);
  get progressType(): "determinate" | "indeterminate";
  set progressType(type: "determinate" | "indeterminate");
  get progressValue(): number;
  set progressValue(value: number);
  get type(): "spinner" | "progress";
  set type(type: "spinner" | "progress");
}
