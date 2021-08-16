import { FontSize } from "./FontSize";
export declare class TextMenu {
  editor: HTMLIonxHtmlEditorElement;
  boldActivated: boolean;
  italicActivated: boolean;
  underlineActivated: boolean;
  activeFontSize: FontSize;
  activeColor: string;
  toggle(name: string): Promise<void>;
  resetFontSize(): Promise<void>;
  toggleFontSize(size: FontSize): Promise<void>;
  toggleColor(color?: string): Promise<void>;
  didDismiss(): void;
  connectedCallback(): void;
  render(): any;
}
