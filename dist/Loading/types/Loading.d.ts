import { LoadingOptions } from "./LoadingOptions";
/**
 * Very customizable loading indicator. It can be used as inline element or within overlay.
 */
export declare class Loading implements LoadingOptions {
  /**
   * If loading element should fill available space and center content both h and v.
   */
  cover?: boolean;
  backdropVisible?: boolean;
  backdropTheme?: "light" | "dark";
  backdropOpacity?: number;
  header?: string;
  message?: string;
  /**
   * @inheritDoc
   */
  type: "spinner" | "progress";
  progressMessage?: string;
  progressType?: "determinate" | "indeterminate";
  progressValue?: number;
  progressBuffer?: number;
  progressPercent?: number;
  color?: string;
  get progressPercentVisible(): boolean;
  get spinnerMode(): boolean;
  get progressMode(): boolean;
  protected el: HTMLElement;
  dismiss(): Promise<void>;
  render(): any;
}
