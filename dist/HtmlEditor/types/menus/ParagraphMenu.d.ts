export declare class ParagraphMenu {
  editor: HTMLIonxHtmlEditorElement;
  activeHeading: number;
  indentLevel(move: 1 | -1): Promise<void>;
  toggleHeading(heading: number): Promise<void>;
  connectedCallback(): void;
  render(): any;
}
