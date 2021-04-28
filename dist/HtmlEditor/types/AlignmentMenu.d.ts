import { Alignment } from "./Alignment";
export declare class AlignmentMenu {
  editor: HTMLIonxHtmlEditorElement;
  active: string;
  toggleAlignment(alignment: Alignment): Promise<void>;
  connectedCallback(): void;
  didDismiss(): void;
  render(): any;
}
