import { ComponentInterface, EventEmitter } from "@stencil/core";
import { Keymap } from "prosemirror-commands";
import { Schema } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { ToolbarItem } from "./toolbar";
export declare class HtmlEditor implements ComponentInterface {
  element: HTMLElement;
  readonly: boolean;
  disabled: boolean;
  value: string;
  schema: Schema;
  plugins: Plugin[];
  keymap: Keymap | Keymap[];
  historyDisabled: boolean;
  toolbarItems: ToolbarItem[];
  /**
   * @internal
   */
  editorSelectionChange: EventEmitter<any>;
  ionChange: EventEmitter<{
    value: string;
  }>;
  getView(): Promise<EditorView<Schema<any, any>>>;
  getState(): Promise<EditorState<Schema>>;
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
