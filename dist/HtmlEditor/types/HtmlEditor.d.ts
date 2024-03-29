import { ComponentInterface, EventEmitter } from "@stencil/core";
import { Schema } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Keymap } from "./Keymap";
import { ToolbarItem } from "./toolbar";
export declare class HtmlEditor implements ComponentInterface {
  element: HTMLElement;
  readonly: boolean;
  disabled: boolean;
  value: string;
  emptyValue: string | null | undefined;
  schema: Schema;
  plugins: Plugin[];
  keymap: Keymap | Keymap[];
  historyDisabled: boolean;
  toolbarItems: ToolbarItem[];
  beforeInitCallback: (() => Promise<any>);
  /**
   * @internal
   */
  editorSelectionChange: EventEmitter<any>;
  ionChange: EventEmitter<{
    value: string;
  }>;
  getView(): Promise<EditorView>;
  getState(): Promise<EditorState>;
  getScheme(): Promise<Schema>;
  setFocus(): Promise<void>;
  /**
   * Set to true, when value changed by user to make sure, that
   * ProseMirror will not be notified about this change.
   * @private
   */
  private valueChangedByProseMirror;
  private scrollParent;
  private view;
  protected valueChanged(value: string, old: string): void;
  protected applyProseMirrorStatus(): void;
  private initEditor;
  private handleEditorScroll;
  private editorDocument;
  private editorValue;
  private onEditorTransaction;
  componentWillLoad(): Promise<void>;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
