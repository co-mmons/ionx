import { ComponentInterface, EventEmitter } from "@stencil/core";
import { EditorView } from "prosemirror-view";
export declare class HtmlEditor implements ComponentInterface {
  element: HTMLElement;
  readonly: boolean;
  disabled: boolean;
  value: string;
  /**
   * @internal
   */
  editorSelectionChange: EventEmitter<any>;
  ionChange: EventEmitter<{
    value: string;
  }>;
  getView(): Promise<EditorView<any>>;
  setFocus(): Promise<void>;
  /**
   * Set to true, when value changed by user to make sure, that
   * ProseMirror will not be notified about this change.
   * @private
   */
  private valueChangedByProseMirror;
  private scrollParent;
  private schema;
  private plugins;
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
