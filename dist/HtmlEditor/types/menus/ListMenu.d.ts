export declare class ListMenu {
  editor: HTMLIonxHtmlEditorElement;
  activeBulletList: boolean;
  activeNumberedList: boolean;
  level(level: number): Promise<void>;
  toggleList(type: "bulletList" | "orderedList"): Promise<void>;
  connectedCallback(): void;
  render(): any;
}
