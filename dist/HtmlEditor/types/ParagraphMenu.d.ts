export declare class ParagraphMenu {
  editor: HTMLIonxHtmlEditorElement;
  activeHeading: number;
  toggleHeading(heading: number): Promise<void>;
  didDismiss(): void;
  connectedCallback(): void;
  render(): any;
}
