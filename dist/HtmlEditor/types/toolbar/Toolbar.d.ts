import { ComponentInterface } from "@stencil/core";
import { EditorView } from "prosemirror-view";
import { ToolbarItem } from "./ToolbarItem";
interface Button {
  labelVisible: boolean;
  iconVisible: boolean;
  label: string;
  iconSrc: string;
  iconName: string;
  active: boolean;
  menuComponent: string;
  menuComponentProps: any | ((view: EditorView) => any | Promise<any>);
  handler: (view: EditorView) => any;
}
export declare class Toolbar implements ComponentInterface {
  element: HTMLElement;
  historyDisabled: boolean;
  items: ToolbarItem[];
  private selectionUnlisten;
  private canUndo;
  private canRedo;
  private buttons;
  private get editor();
  private undo;
  private redo;
  showMenu(view: EditorView, item: ToolbarItem): Promise<void>;
  handleItemClick(_event: MouseEvent, item: Button): Promise<void>;
  forceUpdate(onlyIfChange?: boolean): Promise<void>;
  editorSelectionChanged(): Promise<void>;
  componentDidLoad(): Promise<void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
export {};
