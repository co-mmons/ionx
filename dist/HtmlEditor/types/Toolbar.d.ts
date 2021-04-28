import { HtmlEditorFeatures } from "./HtmlEditorFeatures";
export declare class Toolbar {
  element: HTMLElement;
  features: HtmlEditorFeatures;
  private selectionUnlisten;
  private activeFeatures;
  private canUndo;
  private canRedo;
  private get editor();
  private undo;
  private redo;
  editLink(): void;
  showMenu(event: Event, menu: string): Promise<void>;
  editorSelectionChanged(): Promise<void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
