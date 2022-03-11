import { FontSize } from "./FontSize";
export declare class TextMenu {
  editor: HTMLIonxHtmlEditorElement;
  activeFontSize: FontSize;
  marks: string[];
  activeMarks: string[];
  activeForegroundColor: string;
  activeBackgroundColor: string;
  toggle(markName: string): Promise<void>;
  toggleFontSize(size?: FontSize): Promise<void>;
  toggleColor(mark: "textForegroundColor" | "textBackgroundColor", color?: string): Promise<void>;
  connectedCallback(): void;
  render(): any;
}
