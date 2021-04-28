export interface LoadingOptions {
  message?: string;
  header?: string;
  /**
   * The type of loader.
   */
  type?: "spinner" | "progress";
  progressMessage?: string;
  progressType?: "determinate" | "indeterminate";
  progressValue?: number;
  progressBuffer?: number;
  progressPercent?: number;
  backdropVisible?: boolean;
  backdropTheme?: "light" | "dark";
}
