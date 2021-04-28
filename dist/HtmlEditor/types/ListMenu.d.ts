export declare class ListMenu {
  editor: HTMLIonxHtmlEditorElement;
  activeUnnumberedList: boolean;
  activeNumberedList: boolean;
  level(level: number): Promise<void>;
  toggleList(type: "bulletList" | "orderedList"): Promise<void>;
  didDismiss(): void;
  connectedCallback(): void;
  render(): any;
}
